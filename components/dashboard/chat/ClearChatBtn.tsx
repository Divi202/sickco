import React from 'react';
import { AIResponseProps } from '@/types/dashboard.types';

/* 
--------Plan to develop the clear chat button---------
1. UI body code
2. Functionality of the btn: 
    - Clear the state of user messages & ai responses
    - but all the chat should be present in the db
    - in db ( user message <-> AI response)
        at present only user message -> save in db
        AI respones -> not saved in db 
    - upon the chat entry saved in the db -> temp id interchange with the real db id 
    - ai response id ( saved in db) also linked with the ai response 
    - user chat message is somehow linked with the ai respones


*/

const ClearChatBtn: React.FC<AIResponseProps> = ({ aiResponse }) => (
  <>
    <p>Clear Chats</p>
  </>
);

export default ClearChatBtn;
