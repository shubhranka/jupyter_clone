interface IFrameProps {
    iframeRef: React.RefObject<HTMLIFrameElement>;
}
const IFrame:React.FC<IFrameProps> = ({iframeRef})=>{
    return (
        <iframe ref={iframeRef} sandbox="allow-scripts" title="myIframe"></iframe>
    )   
}

export default IFrame;