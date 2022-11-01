package com.lightfeather.BackendService.utils;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class Utils {
    public static JSONArray jsonArrayFromString(String str) {
        JSONParser parser = new JSONParser();
        JSONArray jsonArray = new JSONArray();
        try {
            Object object = (Object) parser.parse(str);
            jsonArray = (JSONArray) object;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return jsonArray;
    }
}
