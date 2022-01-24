# 1번 리뷰

## 범위
profile.js 파일 56 ~ 98, 145 ~ 172, 506 ~ 521

## 전체 개요
무한 스크롤 구현

## 기능 내용
- renderPage(56 ~ 71)
  - 페이지 로드시 최초 1회 실행되는 함수
  - feedList(프로필 페이지에서 피드 목록이 표시되는 ul element)를 관찰하는 IntersectionObserver 객체를 생성하여 NAME_SPACE에 저장
  - fetchFeedList()로 피드 목록을 불러와서 렌더링함
  - observeLastItem(feedList, 'feed')로 관찰을 시작함

- observeLastItem(73 ~ 78)
  - element 관찰을 시작하는 함수

- unobserveLastItem(80 ~ 84)
  - element 관찰을 종료하는 함수

- getIoCallback(86 ~ 98)
  - IntersectionObserver 생성자 함수를 호출할 때 첫 번째 인자로 전달될 콜백함수를 동적으로 생성하는 함수
  - element(feedList)의 마지막 요소가 관찰되면 관찰을 종료하고 fetchFunc(fecthFeedList)를 실행
  - 만약 불러올 피드가 더 존재한다면 다시 observeLastItem을 실행하여 관찰 시작

- fetchFeedList(145 ~ 172)
  - 피드 목록을 불러오고 화면에 렌더링(renderFeed 실행)하는 함수
  - feedSkip은 초기값이 0이며, 10 미만일 떄에는 ?limit=10&skip=(feedSkip)이지만, 10 이상일 때에는 ?limit=30&skip=(feedSkip-10)으로 쿼리를 보냄
    (즉, 10 미만일 때에는 그냥 10개를 불러오고, 10 이상일 때에는 원래 불러와야 할 값 10개보다 앞뒤로 10개씩을 더 불러온다)
  - prevFeed는 초기값이 빈 배열이며, 비어 있지 않으면 uniquePost에 다음에 불러올 피드 목록 10개(count개)가 담기고, 비어 있다면 응답으로 받아온 json을 그대로 복사한다.
  - prevFeed가 비어 있지 않을 때, uniquePost에는 응답으로 받아온 json에서 prevFeed에 있는 피드와 중복되지 않고 prevFeed의 가장 최신 게시글보다 이전에 작성된 게시글만을 필터링한다.(filter)
    그리고 작성된 시간 역순으로 정렬한다.(sort) 마지막으로 가장 최신의 피드 10개(count개)만 잘라낸다. (slice)
  - 위 과정이 끝난 후 uniquePost가 비어 있지 않으면 화면에 피드를 렌더링하고(renderFeed) prevFeed를 uniquePost로 업데이트한다. uniquePost가 비어 있다면 관찰을 종료한다.
  - 여기서 반환되는 true / false는 getIoCallback의 isLast에서 받음

- deletePost(506 ~ 521)
  - 피드를 삭제하는 함수
  - feedElement는 feedList(ul)의 자식 element(li)이며, 현재 삭제를 하기로 한 피드 1개를 가리킴
  - API에서 삭제 성공하면 feedElement와 그 뒤에 오는 다른 형제 element(li)를 모두 삭제함
  - feedSkip을 현재 남은 피드 개수로 업데이트함
  - fetchFeedList(count)를 실행하여 삭제된 개수(count)만큼만 불러와서 렌더링함 (삭제를 했는데 원래 남아 있던 피드보다 더 불러오는 것 방지하기 위함)

## 기타
- 무한 스크롤을 구현할 때, 단순히 다음 10개씩을 불러오게 하면, 불러오기 직전에 앞뒤의 피드가 삭제되거나 추가되었을 때 피드가 밀리거나 누락되는 현상이 생겨서
  이를 해결하려다 코드가 복잡해졌습니다. 그리고, 삭제/추가되어도 제대로 표시되게 하기 위해 10개가 아닌 앞뒤 10개씩을 더 불러오면서 불필요하게 많은 데이터를 받아오고,
  그리고 10개보다 더 많은 양의 게시글이 삭제되거나 추가되었을 때에는 역시 똑같은 문제가 발생할 것으로 보입니다. 어떻게 해야 근본적으로 이 문제를 해결할 수 있는지 궁금합니다.
