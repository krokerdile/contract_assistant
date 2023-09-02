import React, { useState, useEffect } from "react";
import "./MainPage.scss";
import { OpenAIApi, Configuration } from "openai";
import chatimg from "./chat.png";
import plusimg from "./plus.png";
import promptOneData from "./JsonFile/promptOne.json";
import promptTwoData from "./JsonFile/promptTwo.json";
import promptThreeData from "./JsonFile/promptThree.json";

const KEY = process.env.REACT_APP_OPENAI_API_KEY;

const MainPage =() => {

    const configuration = new Configuration({
        apiKey: KEY,
      });
    
    const openai = new OpenAIApi(configuration);
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatList, setChatList] = useState([]);
    
    useEffect(() => {
        const storedChatList = JSON.parse(localStorage.getItem("chatList")) || [];
        setChatList(storedChatList); // Load chatList from local storage
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const promptValue = `${input1} ${input2} ${input3}`;

        try {
        const result = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: promptValue,
            temperature: 0.5,
            max_tokens: 100,
        });

        setApiResponse(result.data.choices[0].text);

        // Add the new prompt to chatList
        const newChatEntry = {
            input1,
            input2,
            input3,
            prompt: promptValue,
            response: result.data.choices[0].text,
        };

        const updatedChatList = [...chatList, newChatEntry];

        // Save updatedChatList to local storage
        localStorage.setItem("chatList", JSON.stringify(updatedChatList));
        setChatList(updatedChatList);
        console.log("Updated chatList:", updatedChatList);

        setInput1(""); // Clear input1
        setInput2(""); // Clear input2
        setInput3(""); // Clear input3

        } catch (e) {
        setApiResponse("Something is going wrong, Please try again.");
        }
        setLoading(false);
    };

    const handleReset = () => {
        localStorage.removeItem("chatList"); // Clear local storage
        setChatList([]);
        console.log(chatList);
    };

    const populateTextarea1 = () => {
        setInput1(promptOneData.prompt1);
        setInput2(promptOneData.prompt2);
        setInput3(promptOneData.prompt3);
    };

    const populateTextarea2 = () => {
        setInput1(promptTwoData.prompt1);
        setInput2(promptTwoData.prompt2);
        setInput3(promptTwoData.prompt3);
    };

    const populateTextarea3 = () => {
        setInput1(promptThreeData.prompt1);
        setInput2(promptThreeData.prompt2);
        setInput3(promptThreeData.prompt3);
    };
      
    return(
        <div className="all">
            <div className="navbar">
                <div className="navlist">
                    <text className="home">HOME</text>
                    <text className="about">ABOUT</text>
                    <button className="promptcall1" onClick={populateTextarea1}>
                    one
                    </button>
                    <button className="promptcall2" onClick={populateTextarea2}>
                    two
                    </button>
                    <button className="promptcall3" onClick={populateTextarea3}>
                    three
                    </button>
                </div>
            </div>
            <div className="body">
                <div className="sidebar">
                    <div className="chatbox">내 채팅 목록</div>
                    <div className="newchat">
                        <img src={ plusimg } alt="" className="plus" />
                        <img src={ chatimg } alt="" className="chatimg" />
                        <p>새로운 채팅</p>
                    </div>
                    <div className="separator">

                    </div>
                    <div className="chatlist">
                        
                    </div>
                </div>
                <div className="chat">
                    <form onSubmit={handleSubmit} className="question">
                        <div>
                            <label htmlFor="Input1">Input 1:</label>
                            <textarea
                            className="input1area"
                            type="text"
                            value={input1}
                            placeholder="Please ask to openai"
                            onChange={(e) => setInput1(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="Input2">Input 2:</label>
                            <textarea
                            className="input2area"
                            type="text"
                            value={input2}
                            placeholder="Please ask to openai"
                            onChange={(e) => setInput2(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="Input3">Input 3:</label>
                            <textarea
                            className="input3area"
                            type="text"
                            value={input3}
                            placeholder="Please ask to openai"
                            onChange={(e) => setInput3(e.target.value)}
                            ></textarea>
                        </div>
                        <button disabled={loading} type="submit">
                            {loading ? "Generating..." : "Generate"}
                        </button>
                        <button type="button" onClick={handleReset}>
                            Reset
                        </button>
                    </form>
                    <div className="separator2"></div>
                    <div className="answer">
                        <div className="answerlist">
                        Chat List
                        {chatList.map((entry, index) => (
                            <div key={index}>
                            <strong>Prompt:</strong> {entry.prompt}
                            <br />
                            <strong>Response:</strong> {entry.response}
                            <br />
                            <br />
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;