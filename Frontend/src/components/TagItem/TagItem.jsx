import { useState } from 'react';
import './TagItem.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, ModalRequireLogin } from '~/components';
import { apiFollowTag, apiUnfollowTag } from '~/apiServices';
import { useAuth } from '~/hooks';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

const TagItem = ({ tag }) => {
   const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
   const { isLoggedIn } = useAuth();
   const queryClient = useQueryClient();
   const [loading, setLoading] = useState(false);

   const followTagMutation = useMutation({
      mutationFn: apiFollowTag,
      onMutate: () => setLoading(true),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ['tags'],
         });
         setLoading(false);
      },
      onError: () => setLoading(false),
   });

   const unfollowTagMutation = useMutation({
      mutationFn: apiUnfollowTag,
      onMutate: () => setLoading(true),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ['tags'],
         });
         setLoading(false);
      },
      onError: () => setLoading(false),
   });

   const toggleFollowTag = () => {
      if (!isLoggedIn) {
         setIsOpenAuthModal(true);
         return;
      }
      if (!tag?.isFollowing) {
         followTagMutation.mutate(tag._id);
      } else {
         unfollowTagMutation.mutate(tag._id);
      }
   };

   return (
      <div className="tag-item">
         <ModalRequireLogin open={isOpenAuthModal} setOpen={setIsOpenAuthModal} />
         <div className="tag-item__top">
            <div className="tag-item__tag-name">
               <span>#</span>
               <Link to={`/tags/${tag._id}`} className="name">
                  {` ${tag?.name}
`}{' '}
               </Link>
            </div>
            <span className="tag-item__count-post">{`${tag?.posts?.length} post`}</span>
         </div>
         <div className="tag-item__bottom">
            <Button
               primary={!tag?.isFollowing}
               small
               outline={tag?.isFollowing}
               onClick={toggleFollowTag}
               disabled={loading}
            >
               {loading ? (
                  <ClipLoader size={15} color="#fff" />
               ) : tag?.isFollowing ? (
                  'Following'
               ) : (
                  'Follow'
               )}
            </Button>
         </div>
      </div>
   );
};

export default TagItem;
