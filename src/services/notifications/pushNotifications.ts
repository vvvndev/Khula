import webPush from 'web-push';
import { supabase } from '../supabaseClient';

export class PushNotificationService {
  private vapidKeys = {
    publicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    privateKey: import.meta.env.VITE_VAPID_PRIVATE_KEY
  };

  constructor() {
    webPush.setVapidDetails(
      'mailto:support@khula.com',
      this.vapidKeys.publicKey,
      this.vapidKeys.privateKey
    );
  }

  async registerSubscription(userId: string, subscription: PushSubscription) {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        notification_settings: {
          push: true,
          subscription: subscription
        }
      });

    if (error) throw error;
  }

  async sendNotification(userId: string, notification: {
    title: string;
    message: string;
    data?: any;
  }) {
    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .select('notification_settings')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    if (preferences?.notification_settings?.push && preferences?.notification_settings?.subscription) {
      try {
        await webPush.sendNotification(
          preferences.notification_settings.subscription,
          JSON.stringify({
            title: notification.title,
            body: notification.message,
            data: notification.data
          })
        );

        await this.saveNotification(userId, notification);
      } catch (error) {
        console.error('Failed to send push notification:', error);
      }
    }
  }

  private async saveNotification(userId: string, notification: {
    title: string;
    message: string;
    data?: any;
  }) {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'push',
        title: notification.title,
        message: notification.message,
        data: notification.data
      });

    if (error) throw error;
  }
}

export const pushNotificationService = new PushNotificationService();