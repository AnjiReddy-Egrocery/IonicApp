import { AyyappaVideoMerger } from 'ayyappavideomerger';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    AyyappaVideoMerger.echo({ value: inputValue })
}
