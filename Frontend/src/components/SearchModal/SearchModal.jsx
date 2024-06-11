import { Modal } from 'antd';
import './SearchModal.scss';
import { Search } from '~/components';

const SearchModal = ({ isShow, setIsShow }) => {
   const handleCancel = () => {
      setIsShow(false);
   };

   return (
      <div className="search-modal">
         <Modal
            title="Search"
            open={isShow}
            onCancel={handleCancel}
            footer={null}
            style={{ top: 10 }}
            width="100%"
            className="search-modal__container"
         >
            <Search isMobile={true} />
         </Modal>
      </div>
   );
};

export default SearchModal;
