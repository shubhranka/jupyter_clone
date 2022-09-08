interface IFrameProps {
    iframeRef: React.RefObject<HTMLIFrameElement>;
    style: any;
}
const IFrame:React.FC<IFrameProps> = ({iframeRef,style})=>{
    return (
        <iframe style={{...style,backgroundColor:"white",marginLeft:".5rem"}} ref={iframeRef} sandbox="allow-scripts" title="myIframe"></iframe>
    )   
}

export default IFrame;