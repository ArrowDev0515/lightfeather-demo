package com.lightfeather.BackendService.controller;

import com.lightfeather.BackendService.consts.Consts;
import com.lightfeather.BackendService.exception.ResponseEntity;
import com.lightfeather.BackendService.model.NotificationModel;
import com.lightfeather.BackendService.service.impl.NotificationServiceImpl;

import com.lightfeather.BackendService.utils.Utils;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(value = "/api")
public class DemoController {

    Logger logger = LoggerFactory.getLogger(DemoController.class);

    @Autowired
    NotificationServiceImpl demoService;

    @GetMapping(value = "/supervisors")
    public List getSupervisors() {
        logger.info("'/api/supervisors' has been called.");
        String url = "https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers";
        RestTemplate restTemplate = new RestTemplate();
        List list = null;
        try {

            String str = restTemplate.getForObject(url, String.class);
            JSONArray arr = Utils.jsonArrayFromString(str);
            arr.sort(new Comparator<JSONObject>() {
                @Override
                public int compare(JSONObject o1, JSONObject o2) {
                    int ret = 0;
                    ret = o1.get(Consts.STR_SUPERVISOR_FIELD_JURISDICTION).toString()
                            .compareTo(o2.get(Consts.STR_SUPERVISOR_FIELD_JURISDICTION).toString());
                    if (ret == 0) {
                        ret = o1.get(Consts.STR_SUPERVISOR_FIELD_LAST_NAME).toString()
                                .compareTo(o2.get(Consts.STR_SUPERVISOR_FIELD_LAST_NAME).toString());
                        if (ret == 0) {
                            ret = o1.get(Consts.STR_SUPERVISOR_FIELD_FIRST_NAME).toString()
                                    .compareTo(o2.get(Consts.STR_SUPERVISOR_FIELD_FIRST_NAME).toString());
                        }
                    }
                    return ret;
                }
            });

            list = (List) arr.stream().filter((jsonValue) ->
                    !StringUtils.isNumeric(((JSONObject) jsonValue)
                            .get(Consts.STR_SUPERVISOR_FIELD_JURISDICTION).toString())).collect(Collectors.toList());
            list = (List) list.stream().map((jsonValue) ->
                    ((JSONObject) jsonValue).get(Consts.STR_SUPERVISOR_FIELD_JURISDICTION).toString() + " - "
                            + ((JSONObject) jsonValue).get(Consts.STR_SUPERVISOR_FIELD_LAST_NAME).toString() + ", "
                            + ((JSONObject) jsonValue).get(Consts.STR_SUPERVISOR_FIELD_FIRST_NAME).toString())
                    .collect(Collectors.toList());

            logger.info("get supervisor list done.");
            logger.info("Supervisor List -> " + list.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @RequestMapping(value = "/submit")
    public void submit(@Valid @RequestBody NotificationModel item) {
        demoService.createNotification(item);
        logger.info("A new Notification has created successfully.");
        logger.info("New Notification Info -> " + item.getFirstName() + ", " + item.getLastName() + ", " + item.getEmail()
                + ", " + item.getPhoneNumber() + ", " + item.getSupervisor());
//        return ResponseEntity.ok("Notification created successfully.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ResponseEntity<String, String> handleMethodArgumentNotValid(HttpServletRequest req, MethodArgumentNotValidException ex) {
        ResponseEntity<String, String> response = new ResponseEntity<>();
        logger.error("Request: " + req.getRequestURL() + " raised " + ex);
        logger.error(ex.getMessage());
        logger.error(ex.toString());

        logger.error(ex.toString());
        Map<String, String> errors = new HashMap<>();
        final String[] errMsg = {""};
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            errMsg[0] += fieldName + ", ";
            String errorMessage = error.getDefaultMessage();
            error.getCode();
            errors.put(fieldName, errorMessage);
        });

        response.setSuccess(false);
        response.setData(errors);
        response.setMessage(errMsg[0].substring(0, errMsg[0].length() - 2) + " fields are mandatory to input.");
        return response;
    }
}
