package edu.ucsb.cs156.rec.services;

import edu.ucsb.cs156.rec.entities.RequestType;
import edu.ucsb.cs156.rec.repositories.RequestTypeRepository;
import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service for managing Request Types. */
@Service
@Slf4j
public class RequestTypeService {

  @Autowired private RequestTypeRepository requestTypeRepository;

  /** List of hardcoded request types to be loaded at startup. */
  private static final List<String> HARDCODED_REQUEST_TYPES =
      Arrays.asList(
          "CS Department BS/MS program",
          "Scholarship or Fellowship",
          "MS program (other than CS Dept BS/MS)",
          "PhD program",
          "Other");

  /**
   * Load hardcoded request types into the database if they don't already exist.
   *
   * <p>This method checks for each hardcoded request type and only creates it if it's not already
   * in the database.
   */
  public void loadRequestTypes() {
    log.info("Loading hardcoded request types...");
    int loadedCount = 0;
    int skippedCount = 0;

    for (String type : HARDCODED_REQUEST_TYPES) {
      if (requestTypeRepository.findByRequestType(type).isEmpty()) {
        RequestType requestType = RequestType.builder().requestType(type).build();
        requestTypeRepository.save(requestType);
        log.info("Loaded request type: {}", type);
        loadedCount++;
      } else {
        log.debug("Request type already exists, skipping: {}", type);
        skippedCount++;
      }
    }

    log.info("Request type loading completed. Loaded: {}, Skipped: {}", loadedCount, skippedCount);
  }
}
