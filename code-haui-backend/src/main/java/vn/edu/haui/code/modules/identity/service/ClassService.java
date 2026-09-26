package vn.edu.haui.code.modules.identity.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.modules.identity.dto.ClassDto;
import vn.edu.haui.code.modules.identity.entity.Clazz;
import vn.edu.haui.code.modules.identity.entity.Role;
import vn.edu.haui.code.modules.identity.repository.ClassRepository;
import vn.edu.haui.code.modules.identity.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ClassDto> getAllClasses() {
        return classRepository.findAll().stream()
                .map(clazz -> {
                    long count = userRepository.findByClazz_Id(clazz.getId()).stream()
                            .filter(u -> u.getRole() == Role.STUDENT)
                            .count();
                    return ClassDto.fromEntity(clazz, count);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClassDto getClassById(String id) {
        Clazz clazz = classRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_FOUND));
        long count = userRepository.findByClazz_Id(id).stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .count();
        return ClassDto.fromEntity(clazz, count);
    }
}
