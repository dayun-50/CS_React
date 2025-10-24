import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ApprovalList from './Components/approvalList/ApprovalList';
import ApprovalDetail from './Components/approvalDetail/ApprovalDetail';
import ApprovalWrite from './Components/approvalWrite/ApprovalWrite';


function ApprovalIndex(){

    return(

            <Routes>
                <Route path="/" element={<ApprovalList />} />{/* 리스트 뽑는 곳으로 이동 */}
                <Route path="/write" element={<ApprovalWrite />} />
                <Route path="/detail/:seq" element={<ApprovalDetail />} />
            </Routes>

    );
}

export default ApprovalIndex;