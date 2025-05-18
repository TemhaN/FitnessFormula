import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

const NotificationsModal = ({
	notifications,
	onClose,
	onMarkRead,
	onDelete,
}) => {
	const navigate = useNavigate();

	return (
		<div className='modal-overlay'>
			<div className='notifications-modal'>
				<div className='modal-header'>
					<h2>Уведомления</h2>
					<button className='modal-close' onClick={onClose}>
						✕
					</button>
				</div>
				<div className='notifications-list'>
					{notifications.length > 0 ? (
						notifications.map(notification => (
							<div
								key={notification.notificationId}
								className={`notification-card ${
									notification.isRead ? 'read' : 'unread'
								}`}
								onClick={() =>
									notification.workout?.workoutId &&
									navigate(`/workout/${notification.workout.workoutId}`)
								}
							>
								<div className='notification-content'>
									<h4>{notification.title}</h4>
									<p>{notification.message}</p>
									<span className='notification-date'>
										{new Date(notification.sentAt).toLocaleString()}
									</span>
									<span className='notification-type'>
										{notification.notificationType === 'Reminder'
											? 'Напоминание'
											: 'Отмена'}
									</span>
								</div>
								<div className='notification-actions'>
									{!notification.isRead && (
										<button
											className='action-button'
											onClick={() => onMarkRead(notification.notificationId)}
										>
											<FontAwesomeIcon icon={faCheck} />
										</button>
									)}
									<button
										className='action-button'
										onClick={() => onDelete(notification.notificationId)}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							</div>
						))
					) : (
						<p className='no-notifications'>Уведомлений нет</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default NotificationsModal;
