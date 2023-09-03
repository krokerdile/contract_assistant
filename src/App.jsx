import "./App.css";
import styled from "styled-components";
import { useRef, useState, useEffect } from "react";
import "./fonts/Font.css";
import { Configuration, OpenAIApi } from "openai";

// import Slider from "react-slick";

const KEY = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const input = useRef(null);
  const [value, setValue] = useState(0);
  const [test, setTest] = useState("");
  const [recommendTrio, setRecommendTrio] = useState("");
  const handleClick = () => {
    if (input.current) {
      input.current.value = "";
      setValue("");
    }
  };

  const configuration = new Configuration({
    apiKey: KEY,
  });

  const openai = new OpenAIApi(configuration);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [arr, setArr] = useState([]);
  // const [responseList, setResponseList] = useState([]);
  // const [inputList, setInputList] = useState([]);
  const [messages, setMessages] = useState([]);
  // const [temp, setTemp] = useState("");
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, response]);
  useEffect(() => {
    if (response !== "") {
      // 마지막 응답만 추가
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // 이전 메시지 유지
        { text: "GPT: " + response },
      ]);
    }
  }, [response]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { text: "USER: " + value }]);
    if (input.current) {
      input.current.value = "";
      setValue("");
    }
    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: value,
        temperature: 0.5,
        max_tokens: 500,
      });

      setResponse(result.data.choices[0].text);
      setValue(""); // 입력 필드를 지웁니다.
      setMessages((prevMessages) => [...prevMessages, { text: "GPT: " + response }]);
    } catch (e) {
      setResponse("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const testSubmit = async (question) => {
    setLoading(true);
    setTest(question);
    try {
      setMessages((prevMessages) => [...prevMessages, { text: "USER: " + question + "에 대해서 알려줘" }]);
      const prompt = question + "에 대해서 알려주고 주요 항목을 정리해서 200자 이내로 알려줘";
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 500,
      });
      setResponse(result.data.choices[0].text);
      setMessages((prevMessages) => [...prevMessages, { text: "GPT: " + response }]);
      // 근로 계약서에 대해서 사람들이 필수적으로 알아야 할 항목 세가지 알려줘
      console.log(response);
      if (response !== "") {
        console.log(response);
        try {
          const prompt =
            question +
            "에 대해서 사람들이 필수적으로 알아야 할 항목 세가지 알려줘, 세 가지를 전달 할 때 받은 문자열을 만들어서 전달해줘, 큰 따옴표를 둘러서 단어 간의 구분은 콤마로 해서 전달해주면 돼";
          const result = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 500,
          });
          console.log(result.data.choices[0].text);
          console.log(result.data.choices[0].text.replace(/"|\r|\s|\n*/g, ""));
          setRecommendTrio(result.data.choices[0].text.replace(/"|\r|\s|\n*/g, ""));
          console.log(recommendTrio);
          setArr(result.data.choices[0].text.replace(/"|\r|\s|\n*/g, "").split(","));
        } catch (e) {
          console.log("Something went wrong. Please try again.");
        }
      }
    } catch (e) {
      setResponse("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const addButtton = async (topic) => {
    setTest(topic);
    setArr([]);
    try {
      setMessages((prevMessages) => [...prevMessages, { text: "USER: " + topic + "에 대해서 알려줘" }]);
      const prompt = topic + "에 대해서 알려주고 주요 항목을 정리해서 200자 이내로 알려줘";
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 500,
      });
      setResponse(result.data.choices[0].text);
      setMessages((prevMessages) => [...prevMessages, { text: "GPT: " + response }]);
      // 근로 계약서에 대해서 사람들이 필수적으로 알아야 할 항목 세가지 알려줘
      console.log(response);
    } catch (e) {
      setResponse("Something went wrong. Please try again.");
    }
  };

  return (
    <MainBox>
      <Title>Contract Assistant</Title>
      <button disabled={true}>{loading ? "Generating..." : "Generate"}</button>
      <br></br>
      {/* <p>
          현재 검색어는 <strong>{value}</strong>입니다
        </p> */}
      {/* {response != "" && (
          <div className="response">
            <strong>Response:</strong>
            <p>{response}</p>
          </div>
        )} */}
      <ChatContainer ref={chatContainerRef}>
        <MessageList>
          {messages.map((message, index) => (
            <MessageItem key={index}>{message.text}</MessageItem>
          ))}
          {test != "" && arr.length != 0 && (
            <>
              <p>
                사람들이 가장 많이 찾는 <strong>{test}</strong> 관련 질문
              </p>
              <ButtonList>
                {arr.map((item, index) => (
                  <TopicButton key={index} onClick={() => addButtton(item)}>
                    {item}
                  </TopicButton>
                ))}
                <TopicButton onClick={() => addButtton("")}>취소</TopicButton>
              </ButtonList>
            </>
          )}
        </MessageList>
      </ChatContainer>
      <InputWrapper>
        <InputBox
          type="text"
          ref={input}
          onChange={() => {
            setValue(input.current.value);
          }}
        />
        <SearchButton type="button" onClick={handleClick}>
          Reset
        </SearchButton>
        <SearchButton type="button" onClick={handleSubmit}>
          Search
        </SearchButton>
      </InputWrapper>

      <ButtonList>
        <TopicButton onClick={() => testSubmit("근로계약서")}>근로계약서</TopicButton>
        <TopicButton onClick={() => testSubmit("임대차계약서")}>임대차계약서</TopicButton>
        <TopicButton onClick={() => testSubmit("프리랜서계약서")}>프리랜서계약서</TopicButton>
      </ButtonList>
    </MainBox>
  );
}

export default App;

const Title = styled.p`
  font-size: 3rem;
  font-family: "intelone-mono-font-family-regular";
  margin: 0;
  padding: 0;
`;

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 48rem;
  min-width: 48rem;
`;

// const SliderBox = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

const InputBox = styled.input`
  height: 2rem;
  font-family: "intelone-mono-font-family-regular";
  width: 100%;
  font-size: 1.3rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 0.1rem black solid;
`;

const SearchButton = styled.button`
  height: 2rem;
  padding-bottom: 1.6rem;
`;

const TopicButton = styled.button`
  width: 30%;
`;

const ButtonList = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  flex-direction: row;
  margin-top: 1rem;
`;

const ChatContainer = styled.div`
  width: 100%;
  height: 25rem;
  overflow-y: scroll;
  padding: 0.5rem;
`;

const MessageList = styled.ul`
  list-style-type: none;
`;

const MessageItem = styled.li`
  margin-bottom: 10px;
`;
