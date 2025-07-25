import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server : { //서버 설정 - 포트번호 설정 가능 
    proxy : { //프록시 설정 - 특정 경로 패턴에 대한 요청을 다른 서버로 요청할 수 있는 설정
      '/api' : { //api라는 요청 경로로 요청이 들어왔을때 해당 proxy에 설정된 서버로 요청 될 수 있도록 하는 경로 설정
          target:'http://localhost:8889', //대상 서버 
          changeOrigin : true, // 요청 헤더의 host를 target 주소로 변경 될 수 있도록 허용 
          secure : false, // https 인증서 검증 여부 (개발 환경에선 false로 설정후 사용)
          rewrite : (path) => `/boot${path}` //기존 api 경로를 contextRoot 를 추가한 경로로 요청
      }
    }
  }
})
