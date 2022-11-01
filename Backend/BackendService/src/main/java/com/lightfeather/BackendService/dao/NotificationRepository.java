package com.lightfeather.BackendService.dao;

import com.lightfeather.BackendService.model.NotificationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationModel, Integer> {
}
