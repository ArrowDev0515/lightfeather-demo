package com.lightfeather.BackendService.service.impl;

import com.lightfeather.BackendService.dao.NotificationRepository;
import com.lightfeather.BackendService.model.NotificationModel;
import com.lightfeather.BackendService.service.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements INotificationService {

    @Autowired
    NotificationRepository notificationRepository;

    @Override
    public NotificationModel createNotification(NotificationModel item) {
        notificationRepository.save(item);
        return item;
    }
}
