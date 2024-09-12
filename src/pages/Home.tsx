import { ArrowBigUpDash } from 'lucide-react';
import BuzzList from '../components/BuzzList';

// import RecommendUsers from "../components/RecommendUsers";
type Iprops = {
  onScrollToTop: () => void;
};

// raw

const Home = ({ onScrollToTop }: Iprops) => {
  return (
    <>
      <main className='relative'>
        {/* <RecommendUsers /> */}

        <BuzzList />
        <ArrowBigUpDash
          className='fixed bottom-2 right-[5px] lg:right-[20px] w-10 h-10 cursor-pointer hover:text-main'
          onClick={onScrollToTop}
        />
      </main>
    </>
  );
};

export default Home;
