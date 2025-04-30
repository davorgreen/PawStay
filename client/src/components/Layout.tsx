import Footer from './Footer';
import Header from './Header';
import Navbar from './Navbar';

const Layout = ({ children }) => {
	return (
		<div className='min-h-screen flex flex-col'>
			<Navbar />
			<Header />
			<div className='flex-grow'>{children}</div>
			<Footer />
		</div>
	);
};

export default Layout;
