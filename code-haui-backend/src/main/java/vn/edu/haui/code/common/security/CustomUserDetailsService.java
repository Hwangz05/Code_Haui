package vn.edu.haui.code.common.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String codeOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByCode(codeOrEmail)
                .or(() -> userRepository.findByEmail(codeOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với mã/email: " + codeOrEmail));

        return UserPrincipal.create(user);
    }
}
