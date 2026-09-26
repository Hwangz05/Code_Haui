package vn.edu.haui.code.modules.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;
import vn.edu.haui.code.modules.notification.dto.NotificationDto;
import vn.edu.haui.code.modules.notification.entity.Notification;
import vn.edu.haui.code.modules.notification.repository.NotificationRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(String userCode) {
        User user = userRepository.findByCode(userCode)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId()).stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String userCode) {
        User user = userRepository.findByCode(userCode)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return notificationRepository.countByUser_IdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long notificationId, String userCode) {
        User user = userRepository.findByCode(userCode)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (!notif.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        notif.setIsRead(true);
        notificationRepository.save(notif);
    }
}
