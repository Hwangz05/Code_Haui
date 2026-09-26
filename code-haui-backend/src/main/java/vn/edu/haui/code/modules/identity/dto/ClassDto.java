package vn.edu.haui.code.modules.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.identity.entity.Clazz;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassDto {

    private String id;
    private String name;
    private String faculty;
    private String academicYear;
    private long studentCount;

    public static ClassDto fromEntity(Clazz clazz, long studentCount) {
        if (clazz == null) return null;
        return ClassDto.builder()
                .id(clazz.getId())
                .name(clazz.getName())
                .faculty(clazz.getFaculty())
                .academicYear(clazz.getAcademicYear())
                .studentCount(studentCount)
                .build();
    }
}
