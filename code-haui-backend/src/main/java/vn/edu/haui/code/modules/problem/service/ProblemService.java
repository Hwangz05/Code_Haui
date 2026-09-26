package vn.edu.haui.code.modules.problem.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.dto.PageResponse;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;
import vn.edu.haui.code.modules.problem.dto.CreateProblemRequest;
import vn.edu.haui.code.modules.problem.dto.ProblemDetailDto;
import vn.edu.haui.code.modules.problem.dto.ProblemDto;
import vn.edu.haui.code.modules.problem.entity.Category;
import vn.edu.haui.code.modules.problem.entity.Difficulty;
import vn.edu.haui.code.modules.problem.entity.Problem;
import vn.edu.haui.code.modules.problem.entity.SubmissionStatus;
import vn.edu.haui.code.modules.problem.entity.Testcase;
import vn.edu.haui.code.modules.problem.repository.CategoryRepository;
import vn.edu.haui.code.modules.problem.repository.ProblemRepository;
import vn.edu.haui.code.modules.problem.repository.SubmissionRepository;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final CategoryRepository categoryRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Transactional(readOnly = true)
    public PageResponse<ProblemDto> getProblems(
            Integer categoryId,
            Difficulty difficulty,
            String keyword,
            Boolean isPublished,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Problem> problemPage = problemRepository.searchProblems(categoryId, difficulty, keyword, isPublished, pageable);

        Page<ProblemDto> dtoPage = problemPage.map(problem -> {
            ProblemDto dto = ProblemDto.fromEntity(problem);
            long totalSubmissions = submissionRepository.countByProblem_Id(problem.getId());
            long acceptedSubmissions = submissionRepository.countByProblem_IdAndStatus(problem.getId(), SubmissionStatus.AC);
            double rate = totalSubmissions > 0 ? (double) acceptedSubmissions / totalSubmissions * 100 : 0.0;

            dto.setTotalSubmissions(totalSubmissions);
            dto.setAcceptedSubmissions(acceptedSubmissions);
            dto.setAcceptanceRate(Math.round(rate * 10.0) / 10.0);
            return dto;
        });

        return PageResponse.from(dtoPage);
    }

    @Transactional(readOnly = true)
    public ProblemDetailDto getProblemBySlug(String slug) {
        Problem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.PROBLEM_NOT_FOUND));
        return ProblemDetailDto.fromEntity(problem);
    }

    @Transactional(readOnly = true)
    public ProblemDetailDto getProblemById(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROBLEM_NOT_FOUND));
        return ProblemDetailDto.fromEntity(problem);
    }

    @Transactional
    public ProblemDetailDto createProblem(CreateProblemRequest request, String authorCode) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        User author = userRepository.findByCode(authorCode).orElse(null);

        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = toSlug(request.getTitle());
        }

        // Ensure unique slug
        String baseSlug = slug;
        int count = 1;
        while (problemRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + (++count);
        }

        Problem problem = Problem.builder()
                .title(request.getTitle())
                .slug(slug)
                .category(category)
                .difficulty(request.getDifficulty())
                .points(request.getPoints() != null ? request.getPoints() : 100)
                .timeLimitMs(request.getTimeLimitMs() != null ? request.getTimeLimitMs() : 1000)
                .memoryLimitMb(request.getMemoryLimitMb() != null ? request.getMemoryLimitMb() : 256)
                .statementMd(request.getStatementMd())
                .author(author)
                .isPublished(true)
                .testcases(new ArrayList<>())
                .build();

        if (request.getTestcases() != null) {
            int order = 1;
            for (CreateProblemRequest.TestcaseRequest t : request.getTestcases()) {
                Testcase testcase = Testcase.builder()
                        .problem(problem)
                        .inputData(t.getInputData())
                        .expectedOutput(t.getExpectedOutput())
                        .isSample(Boolean.TRUE.equals(t.getIsSample()))
                        .orderIndex(order++)
                        .build();
                problem.getTestcases().add(testcase);
            }
        }

        Problem savedProblem = problemRepository.save(problem);
        return ProblemDetailDto.fromEntity(savedProblem);
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
