# MemeFridge

## Preview
과거, 현재 유행하는 유행어 및 짤방 등을 등록할 수 있고, 미래에 유행할 것 같은 컨텐츠들을 AI가 예측하여 알려주는, "밈"을 모아둔 서비스입니다.<br>
웹 전반적인 디자인은 꾸준히 수정해나갈 예정이며, 서비스 로직을 우선하여 개발하고 있습니다.

서비스 주소 - https://jiho95.duckdns.org


### Related project
FastAPI를 활용한 LLM데이터 수집 앱 - https://github.com/kypa123/MemeFridge-data<br>
해당 프로젝트에서 ChatGPT API를 통해 buzzword 데이터를 가져오고, REST api를 통해 본 서비스에 데이터를 제공합니다.
<hr>

## 시스템 아키텍쳐
<img width="878" alt="밈장고 인프라2" src="https://github.com/kypa123/MemeFridge/assets/86966661/72cc7116-4b0d-45c4-9bcd-a4fa216a85da">

## ERD
<img width="1009" alt="밈장고 erd" src="https://github.com/kypa123/MemeFridge/assets/86966661/ba11e8ea-103f-437e-8452-dabd501b5ae4">


## Project Structure

해당 프로젝트 구조는 총 3개의 부분으로 나뉩니다.

1. src
<img width="328" alt="스크린샷 2023-10-02 오후 2 09 32" src="https://github.com/kypa123/MemeFridge/assets/86966661/0ea1eaa1-3cbd-4a50-aa42-e3ccbbadedaa">

프로젝트의 소스코드를 작성한 곳입니다.

- app.ts: express application을 설정하고, 라우터와 미들웨어를 등록합니다. 그리고, 만들어진 application을 export합니다.
- config/index.ts: .env 파일로 관리되는 환경변수를 객체에 담아 export합니다.
- controller: router 모듈에서 들어온 요청을 처리합니다. 요청에 따라 올바른 service를 호출하고 response합니다.
- db: pg 라이브러리를 통해 메인 데이터베이스(PostgreSQL)와의 connection pool을 형성하고, 요청을 처리하는 로우쿼리가 작성되어 있습니다.
  - connectionInfo.ts: config/index.ts에서 데이터베이스 connection string을 import하고 export합니다.
  - models: pg.Pool을 매개변수로 받아 초기화하는 model Class가 작성되어 있습니다. ORM을 사용하지 않았기 때문에, class 내부에는 로우 쿼리가 작성된 메소드들이 작성되어 있습니다.
  - index.ts: pg 라이브러리를 통해 pool을 생성하고, models 디렉토리에서 import한 model 객체의 인스턴스에 pg pool 객체를 넘겨 생성합니다. 그리고 이를 export합니다.
 
- interfaces/index.ts: 본 프로젝트의 인터페이스가 작성되어 있습니다.
- middlewares: 본 프로젝트의 express middleware 모듈이 작성되어 있습니다. 모든 모듈을 index.ts에서 import, export하여 외부에서 접근하기 용이하게 하였습니다.
- routes: express router 모듈들이 작성되어 있습니다. 경로에 따라 올바른 controller에 요청을 전달합니다.
- services: controller에서 넘겨받은 요청을 처리하는 로직이 작성되어 있습니다. 필요에 따라 db/model에 요청을 전달합니다.
- utils: 자주 사용되는 함수들을 모듈화하여 저장하였습니다.


2. test
<img width="362" alt="스크린샷 2023-10-02 오후 2 10 08" src="https://github.com/kypa123/MemeFridge/assets/86966661/1bcb2814-0e9c-4eb1-a3c3-89d743ea0437">

본 서비스의 테스트케이스를 포함하고 있습니다.<br>
supertest, jest 라이브러리를 활용하여 통합, 유닛테스트를 진행하였습니다.
- integration: api의 통합테스트 파일을 포함
- test-environment/app.ts: 본 서비스의 환경을 모방한, 테스트 환경을 담은 모듈.
- unit: 유닛테스트 파일을 포함

3. 설정파일, bin 디렉토리
<img width="171" alt="스크린샷 2023-10-02 오후 2 09 55" src="https://github.com/kypa123/MemeFridge/assets/86966661/3b584541-597e-4bf0-94b8-eac93cf07739">

설정파일, 프로젝트 실행파일을 담고 있습니다.


## 주요 개발내용

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

4. ORM을 사용하지 않고, 로우쿼리로 코드를 작성
   - pg라이브러리로 데이터베이스 커넥션을 형성하고, 모든 CRUD 및 데이터베이스 쿼리를 직접 로우쿼리로 작성했습니다.

5. github actions를 통한 자동화배포, 테스트 진행
   - supertest, jest 라이브러리를 통한 통합 테스트를 진행했습니다.
   - github actions의 workflow로 test를 먼저 실행, 모든 테스트를 통과하면 클라우드 인스턴스에 자동 배포가 진행되도록 설정하였습니다.
