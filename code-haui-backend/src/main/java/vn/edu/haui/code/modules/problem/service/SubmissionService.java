package vn.edu.haui.code.modules.problem.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;
import vn.edu.haui.code.modules.problem.dto.SubmissionDto;
import vn.edu.haui.code.modules.problem.dto.SubmitCodeRequest;
import vn.edu.haui.code.modules.problem.entity.Problem;
import vn.edu.haui.code.modules.problem.entity.Submission;
import vn.edu.haui.code.modules.problem.entity.SubmissionStatus;
import vn.edu.haui.code.modules.problem.repository.ProblemRepository;
import vn.edu.haui.code.modules.problem.repository.SubmissionRepository;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    private final Random random = new Random();

    @Transactional
    public SubmissionDto submitCode(SubmitCodeRequest request, String userCode) {
        User user = userRepository.findByCode(userCode)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new AppException(ErrorCode.PROBLEM_NOT_FOUND));

        // Evaluate Code: For demonstration and instant testing, we simulate evaluation based on code quality
        // If code has basic syntax / keywords, it will pass AC, otherwise test status
        SubmissionStatus status = SubmissionStatus.AC;
        int runtimeMs = 35 + random.nextInt(40);
        int memoryKb = 15000 + random.nextInt(8000);
        int score = problem.getPoints();

        String code = request.getSourceCode().trim();
        if (code.length() < 10) {
            status = SubmissionStatus.CE;
            score = 0;
        } else if (code.contains("throw") || code.contains("error")) {
            status = SubmissionStatus.WA;
            score = 0;
        } else if (code.contains("while(true)") || code.contains("Thread.sleep")) {
            status = SubmissionStatus.TLE;
            score = 0;
        }

        // Save submission
        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .sourceCode(request.getSourceCode())
                .language(request.getLanguage().toUpperCase())
                .status(status)
                .runtimeMs(runtimeMs)
                .memoryUsedKb(memoryKb)
                .scoreEarned(score)
                .build();

        Submission saved = submissionRepository.save(submission);

        // Update user points if AC and first time AC
        if (status == SubmissionStatus.AC) {
            boolean alreadyAcBefore = submissionRepository.existsByUser_IdAndProblem_IdAndStatus(
                    user.getId(), problem.getId(), SubmissionStatus.AC
            );
            if (!alreadyAcBefore) {
                user.setTotalPoints(user.getTotalPoints() + score);
                userRepository.save(user);
            }
        }

        return SubmissionDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<SubmissionDto> getMySubmissions(String userCode) {
        User user = userRepository.findByCode(userCode)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return submissionRepository.findByUser_IdOrderByCreatedAtDesc(user.getId()).stream()
                .map(SubmissionDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SubmissionDto> getProblemSubmissions(Long problemId) {
        return submissionRepository.findByProblem_IdOrderByCreatedAtDesc(problemId).stream()
                .map(SubmissionDto::fromEntity)
                .collect(Collectors.toList());
    }
}
