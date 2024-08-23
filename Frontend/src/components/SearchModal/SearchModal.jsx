import { Drawer } from 'antd';
import './SearchModal.scss';
import { Search } from '~/components';

const SearchModal = ({ isShow, setIsShow }) => {
   const handleClose = () => {
      setIsShow(false);
   };

   return (
      <div className="search-modal">
         <Drawer
            title="Search"
            placement="top"
            closable={true}
            onClose={handleClose}
            open={isShow}
            height="100%"
            width="100%"
            className="search-modal__container"
         >
            <Search isMobile={true} />
         </Drawer>
      </div>
   );
};

export default SearchModal;
