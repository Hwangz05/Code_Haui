package vn.edu.haui.code.modules.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.problem.entity.Testcase;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestcaseDto {
    private Long id;
    private String inputData;
    private String expectedOutput;
    private Boolean isSample;
    private Integer orderIndex;

    public static TestcaseDto fromEntity(Testcase testcase) {
        if (testcase == null) return null;
        return TestcaseDto.builder()
                .id(testcase.getId())
                .inputData(testcase.getInputData())
                .expectedOutput(testcase.getExpectedOutput())
                .isSample(testcase.getIsSample())
                .orderIndex(testcase.getOrderIndex())
                .build();
    }
}
