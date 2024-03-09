import { TaskStatus } from '../entity/TaskStatus';

interface IBaseVoiceRecognitionAdapter {
  /**
   * upload the audio file and get an unique code
   * @param audioData the base64 encoded string of audio file
   * @return the unique code of the task
   */
  uploadVoiceFileAsync(audioData: string): Promise<string>;

  /**
   * get the result of the task
   * @param taskId the unique code of the task
   * @return the result of the task
   */
  getVoiceResult(taskId: string): Promise<TaskStatus>;
}

export default IBaseVoiceRecognitionAdapter;
