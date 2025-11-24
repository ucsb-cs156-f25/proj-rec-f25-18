package edu.ucsb.cs156.rec.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.rec.entities.RequestType;
import edu.ucsb.cs156.rec.repositories.RequestTypeRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class RequestTypeServiceTest {

  @Mock private RequestTypeRepository requestTypeRepository;

  @InjectMocks private RequestTypeService requestTypeService;

  @Test
  public void test_loadRequestTypes_loadsAllTypesWhenNoneExist() {
    // Arrange
    when(requestTypeRepository.findByRequestType(any(String.class))).thenReturn(Optional.empty());

    // Act
    requestTypeService.loadRequestTypes();

    // Assert
    // Should save 5 request types: CS Department BS/MS program, Scholarship or Fellowship,
    // MS program (other than CS Dept BS/MS), PhD program, Other
    verify(requestTypeRepository, times(5)).save(any(RequestType.class));
    verify(requestTypeRepository, times(5)).findByRequestType(any(String.class));
  }

  @Test
  public void test_loadRequestTypes_skipsExistingTypes() {
    // Arrange
    RequestType existingType = RequestType.builder().id(1L).requestType("Other").build();

    // Mock that some types exist and some don't
    when(requestTypeRepository.findByRequestType("CS Department BS/MS program"))
        .thenReturn(Optional.empty());
    when(requestTypeRepository.findByRequestType("Scholarship or Fellowship"))
        .thenReturn(Optional.of(existingType));
    when(requestTypeRepository.findByRequestType("MS program (other than CS Dept BS/MS)"))
        .thenReturn(Optional.empty());
    when(requestTypeRepository.findByRequestType("PhD program")).thenReturn(Optional.empty());
    when(requestTypeRepository.findByRequestType("Other")).thenReturn(Optional.of(existingType));

    // Act
    requestTypeService.loadRequestTypes();

    // Assert
    // Should only save 3 new types (skipping "Scholarship or Fellowship" and "Other")
    verify(requestTypeRepository, times(3)).save(any(RequestType.class));
    verify(requestTypeRepository, times(5)).findByRequestType(any(String.class));
  }

  @Test
  public void test_loadRequestTypes_skipsAllWhenAllExist() {
    // Arrange
    RequestType existingType = RequestType.builder().id(1L).requestType("Some Type").build();

    when(requestTypeRepository.findByRequestType(any(String.class)))
        .thenReturn(Optional.of(existingType));

    // Act
    requestTypeService.loadRequestTypes();

    // Assert
    // Should not save any types since all already exist
    verify(requestTypeRepository, times(0)).save(any(RequestType.class));
    verify(requestTypeRepository, times(5)).findByRequestType(any(String.class));
  }
}
