//package com.lightfeather.BackendService.utils;
//
//import com.fasterxml.jackson.annotation.JsonInclude;
//import jdk.nashorn.internal.objects.annotations.Getter;
//import jdk.nashorn.internal.objects.annotations.Setter;
//
//import java.util.List;
//import java.util.Objects;
//
//@Getter
//@Setter
//@RequiredArgsConstructor
//@JsonInclude(JsonInclude.Include.NON_NULL)
//public class ErrorResponse {
//    private final int status;
//    private final String message;
//    private String stackTrace;
//    private List<ValidationError> errors;
//
//    @Getter
//    @Setter
//    @RequiredArgsConstructor
//    private static class ValidationError {
//        private final String field;
//        private final String message;
//    }
//
//    public void addValidationError(String field, String message){
//        if(Objects.isNull(errors)){
//            errors = new ArrayList<>();
//        }
//        errors.add(new ValidationError(field, message));
//    }
//}