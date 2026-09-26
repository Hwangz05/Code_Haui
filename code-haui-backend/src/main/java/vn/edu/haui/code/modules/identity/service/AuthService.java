package vn.edu.haui.code.modules.identity.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.common.security.JwtTokenProvider;
import vn.edu.haui.code.modules.identity.dto.AuthResponse;
import vn.edu.haui.code.modules.identity.dto.LoginRequest;
import vn.edu.haui.code.modules.identity.dto.RegisterRequest;
import vn.edu.haui.code.modules.identity.dto.UserDto;
import vn.edu.haui.code.modules.identity.entity.Clazz;
import vn.edu.haui.code.modules.identity.entity.Role;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.ClassRepository;
import vn.edu.haui.code.modules.identity.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByCode(request.getCode())
                .or(() -> userRepository.findByEmail(request.getCode()))
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        // For demo convenience: if database has placeholder hash or plaintext match
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash())
                || request.getPassword().equals(user.getPasswordHash())
                || "haui@2026".equals(request.getPassword()); // HaUI fallback for quick onboarding

        if (!matches) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = jwtTokenProvider.generateTokenFromUserCode(user.getCode());

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS, "Mã sinh viên đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS, "Email đã tồn tại");
        }

        Clazz clazz = null;
        if (request.getClassId() != null && !request.getClassId().isBlank()) {
            clazz = classRepository.findById(request.getClassId())
                    .orElse(null);
        }

        Role role = request.getCode().toUpperCase().startsWith("GV") ? Role.TEACHER : Role.STUDENT;

        User newUser = User.builder()
                .code(request.getCode())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .clazz(clazz)
                .totalPoints(0)
                .rankTitle(role == Role.TEACHER ? "Giảng viên" : "Newbie")
                .streakDays(0)
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .build();

        userRepository.save(newUser);

        String token = jwtTokenProvider.generateTokenFromUserCode(newUser.getCode());

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(UserDto.fromEntity(newUser))
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String code) {
        User user = userRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return UserDto.fromEntity(user);
    }
}
