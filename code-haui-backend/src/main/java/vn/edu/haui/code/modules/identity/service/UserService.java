package vn.edu.haui.code.modules.identity.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.modules.identity.dto.UserDto;
import vn.edu.haui.code.modules.identity.entity.Role;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserByCode(String code) {
        User user = userRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getStudentsByClass(String classId) {
        return userRepository.findByClazz_Id(classId).stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDto> getLeaderboard() {
        return userRepository.findTop10ByRoleOrderByTotalPointsDesc(Role.STUDENT).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
}
