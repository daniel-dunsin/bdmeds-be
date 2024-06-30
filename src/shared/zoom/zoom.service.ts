import { Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';
import { CreateZoomEvent } from './interfaces/request';
import { ZoomCallResponse } from './interfaces/response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ZoomService {
   private baseUrl: string = 'https://api.zoom.us/v2/users/me';

   constructor(private readonly configService: ConfigService) {}

   private async getZoomAccessToken() {
      const tokenUrl = 'https://zoom.us/oauth/token';

      const clientId = this.configService.get('ZOOM_CLIENT_ID');
      const clientSecret = this.configService.get('ZOOM_CLIENT_SECRET');
      const accountId = this.configService.get('ZOOM_ACCOUNT_ID');

      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      try {
         const response = await axios.post(
            tokenUrl + `?grant_type=account_credentials&account_id=${accountId}`,
            {},
            {
               headers: {
                  Authorization: `Basic ${auth}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
               },
            },
         );
         return response.data.access_token;
      } catch (error) {
         console.error('Error fetching Zoom access token:', error);
         throw new Error('Error fetching Zoom access token');
      }
   }

   async createZoomEvent(body: CreateZoomEvent): Promise<ZoomCallResponse> {
      const accessToken = await this.getZoomAccessToken();
      const { attendees, topic, description, schedule } = body;

      const meetingData = {
         topic: topic,
         start_time: schedule.toISOString(),
         duration: 60,
         timezone: 'Africa/Lagos',
         agenda: description,
         settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            mute_upon_entry: true,
            use_pmi: false,
            approval_type: 0,
            meeting_invitees: attendees.map((email) => ({ email })),
            waiting_room: false,
         },
      };

      const response = await axios.post(`${this.baseUrl}/meetings`, meetingData, {
         headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
         },
      });

      return response?.data;
   }

   async deleteZoomEvent(meetingId: string) {
      const accessToken = await this.getZoomAccessToken();
      try {
         const response = await axios.delete(
            `${this.baseUrl}/meetings/${meetingId}?cancel_meeting_reminder=true&schedule_for_reminder=true`,
            {
               headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
               },
            },
         );

         return response?.data;
      } catch (error) {
         console.error('Unable to create zoom event', event);
         throw error;
      }
   }
}
