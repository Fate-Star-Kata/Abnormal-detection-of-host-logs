import serviceAxios from '@/http'
import type { detectionResponse, PostDetectionBody } from '@/types/apis/user/common'

export function getDetection(): Promise<detectionResponse> {
  return serviceAxios({
    url: '/malicious/realtime-detection/',
    method: 'get',
  })
}

export function postDetection(data: PostDetectionBody): Promise<detectionResponse> {
  return serviceAxios({
    url: '/malicious/realtime-detection/',
    method: 'post',
    data,
  })
}