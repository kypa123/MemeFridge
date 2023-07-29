# MemeFridge

과거, 현재 유행하는 유행어 및 짤방 등을 등록할 수 있고, 미래에 유행할 것 같은 컨텐츠들을 AI가 예측하여 알려주는, "밈"을 모아둔 서비스입니다.
웹 전반적인 디자인은 꾸준히 수정해나갈 예정이며, 서비스 로직을 우선하여 개발하고 있습니다.

FastAPI를 활용한 LLM데이터 수집 앱 - https://github.com/kypa123/MemeFridge-data

서비스 주소 - jiho95.duckdns.org

- 시스템 아키텍쳐
<img width="878" alt="밈장고 인프라2" src="https://github.com/kypa123/MemeFridge/assets/86966661/72cc7116-4b0d-45c4-9bcd-a4fa216a85da">

- ERD
<img width="1009" alt="밈장고 erd" src="https://github.com/kypa123/MemeFridge/assets/86966661/ba11e8ea-103f-437e-8452-dabd501b5ae4">

해당 프로젝트의 주요 개발내용은 다음과 같습니다.

1. Redis를 활용하여 가장 높은 조회수 데이터, 가장 최근 조회된 태그를 캐싱
- 가장 높은 조회수를 가진 데이터 및 태그들을 서비스 상단에 노출시켰고, 해당 기능을 위해 인메모리 데이터베이스인 Redis 를 활용하여 데이터를 캐싱하였습니다.
- 랭킹은 컨텐츠의 조회수를 기준으로 매겨지며, main 페이지를 로드할 때 마다 데이터를 순위로 정렬하지 않기 위해 redis를 채용하였습니다.
- 컨텐츠를 클릭하면 detail page로 이동하게 되는데, 이때 해당 컨텐츠 정보를 불러오며 컨텐츠 조회수 업데이트가 이루어지며, redis에 해당 데이터가 존재하지 않는다면 redis에 랭크 업데이트 과정을 거치고 있습니다.

2. Docker compose를 활용한 컨테이너 배포
   - redis, postgres, node app을 컨테이너화하여 배포, compose로 네트워크를 형성하여 OCI 클라우드환경에 배포하였습니다.
     https://github.com/kypa123/MemeFridge/blob/master/docker-compose.yml

3. Nginx를 활용한 https 적용
   - 별도의 인스턴스에 docker container를 띄워 nginx를 실행하고, Certbot certificate를 통한 ssl 인증처리로 https를 적용하였습니다.
