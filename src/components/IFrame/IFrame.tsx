interface IFrameProps {
    iframeRef: React.RefObject<HTMLIFrameElement>;
}
const IFrame:React.FC<IFrameProps> = ({iframeRef})=>{
    return (
        <iframe style={{backgroundColor:"white"}} ref={iframeRef} sandbox="allow-scripts" title="myIframe"></iframe>
    )   
}

export default IFrame;