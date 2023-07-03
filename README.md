# MemeFridge

과거, 현재 유행하는 유행어 및 짤방 등, "밈" 컨텐츠를 모아둔 서비스입니다.
웹 전반적인 디자인은 꾸준히 수정해나갈 예정이며, 서비스 로직을 우선하여 개발하고 있습니다.
서비스 주소 - jiho95.duckdns.org

- 시스템 아키텍쳐

![밈장고 인프라](https://github.com/kypa123/MemeFridge/assets/86966661/d25d867c-f8bf-45b1-acb7-f72c79dfa7f0)


해당 프로젝트의 주요 개발내용은 다음과 같습니다.

1. multipart formdata를 readableStream으로, 서버에 저장하지 않고 Cloudinary 이미지 저장소에 업로드
  - Node.js환경의 업로드는 많은 상황에서 Multer 모듈을 활용하여 서버에 한 차례 저장하고, 저장된 path를 기준으로 데이터를 업로드하는 2단계 과정을 거칩니다.
  - 이러한 서버의 부하를 줄이고자 connect-busboy 모듈을 사용해 formData를 on 함수로 file, field 이벤트를 통해 stream parse 단계를 거쳐 form data를 처리했습니다
    https://github.com/kypa123/MemeFridge/blob/master/src/middlewares/image-upload.ts
    
2. Redis를 활용하여 상위권 랭킹 4개의 데이터를 cache하고, main 화면에서 랭크 데이터를 빠르게 가져옴
  - 랭킹은 컨텐츠의 조회수를 기준으로 매겨지며, main 페이지를 로드할 때 마다 데이터를 순위로 정렬하지 않기 위해 redis를 채용하였습니다.
  - 컨텐츠를 클릭하면 detail page로 이동하게 되는데, 이때 해당 컨텐츠 정보를 불러오며 컨텐츠 조회수 업데이트, redis에 랭크 업데이트 과정을 거치고 있습니다.
    
![스크린샷 2023-06-21 오후 7 27 38](https://github.com/kypa123/MemeFridge/assets/86966661/a18952c5-868c-4915-890f-8ed9f55b33f9)
![스크린샷 2023-06-21 오후 7 28 21](https://github.com/kypa123/MemeFridge/assets/86966661/51f44770-bb85-4e2a-9c92-3a9829762ea0)

      
3. Docker compose를 활용한 컨테이너 배포
   - redis, postgres, node app을 컨테이너화하여 배포, compose로 네트워크를 형성하여 OCI 클라우드환경에 배포하였습니다.
  https://github.com/kypa123/MemeFridge/blob/master/docker-compose.yml


4. Nginx를 활용한 https 적용
   - 별도의 인스턴스에 docker container를 띄워 nginx를 실행하고, Certbot certificate를 통한 ssl 인증처리로 https를 적용하였습니다.
