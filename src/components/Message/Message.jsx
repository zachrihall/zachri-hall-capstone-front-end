import './Message.scss';

function Message(props) {

    if (props.sent) {
        return (
            <div className="message-row message-row--sent">
                <div className="message message-row__sent-message">
                    {/* <img className='message-row__sent-message-pfp'></img> */}
                    <div className='message-row__sent-message-container'>
                        <p className='message-row__sent-message-container-message'>Sent: {props.message}</p>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className='message-row message-row--received'>
                <div className="message message-row__received-message">
                    {/* <img className='message-row__received-message-pfp'></img> */}
                    <div className='message-row__received-message-container'>
                        <p className='message-row__received-message-container-message'>Received: {props.message}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Message;