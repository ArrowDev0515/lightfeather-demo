package com.lightfeather.BackendService.exception;

import java.util.Map;

public class ResponseEntity<T1, T2> {
    private Boolean success;
    private Integer code;
    private String message;
    private Map<T1, T2> data;

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean status) {
        this.success = status;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<T1, T2> getData() {
        return data;
    }

    public void setData(Map<T1, T2> data) {
        this.data = data;
    }
}
