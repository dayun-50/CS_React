import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ApprovalList from './Components/approvalList/ApprovalList';


function ApprovalIndex(){

    return(

            <Routes>
                <Route path="/" element={<ApprovalList />} />{/* 리스트 뽑는 곳으로 이동 */}
            </Routes>

    );
}

export default ApprovalIndex;