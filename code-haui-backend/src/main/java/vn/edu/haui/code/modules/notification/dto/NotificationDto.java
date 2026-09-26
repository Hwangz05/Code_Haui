package vn.edu.haui.code.modules.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.notification.entity.Notification;
import vn.edu.haui.code.modules.notification.entity.NotificationType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private NotificationType type;
    private String title;
    private String body;
    private String link;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationDto fromEntity(Notification notif) {
        if (notif == null) return null;
        return NotificationDto.builder()
                .id(notif.getId())
                .type(notif.getType())
                .title(notif.getTitle())
                .body(notif.getBody())
                .link(notif.getLink())
                .isRead(notif.getIsRead())
                .createdAt(notif.getCreatedAt())
                .build();
    }
}
