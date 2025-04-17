import { FaInstagram, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
	return (
		<div className=' bg-blue-500 text-white py-10 px-6'>
			<div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
				<div className='flex flex-col'>
					<h3 className='text-xl font-semibold mb-4'>Contact</h3>
					<p>Phone: 561-366-9000</p>
					<p>Fax: 561-366-9001</p>
					<p className='mt-3 mb-3'>
						418 Park Place, West Palm Beach, FL 33401
					</p>
					<p className=''>Monday-Friday : 7am - 7pm</p>
					<p className=''>Saturday : 8am - 6pm</p>
					<p className=''>Sunday : 11:30am - 1pm</p>
				</div>
				<div>
					<h3 className='text-xl font-semibold mb-4'>Latest News</h3>
					<p className='mb-2 font-medium'>
						Training Rescue Dogs Overcoming Trauma and Building Trust
					</p>
					<p className='text-sm mb-4'>April 09, 2025</p>

					<p className='mb-2 font-medium'>
						The Importance of Dog Hotel Safety and Security Measures
					</p>
					<p className='text-sm'>April 09, 2025</p>
				</div>
				<div>
					<h3 className='text-xl font-semibold mb-4'>
						Upcoming Events
					</h3>
					<p className='mb-3'>
						Apr 16 — Couch Paw-tato Movie Day ($9.00)
					</p>
					<p>
						Apr 17 — Easter Egg Hunt (Dress up in your Easter attire)
					</p>
				</div>
			</div>
			<div className='mt-10 border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center text-md'>
				<p>© PawStay 2025</p>
				<div className='flex gap-4 mt-4 md:mt-0'>
					<button className='hover:text-gray-400'>
						<FaInstagram size={30} />
					</button>
					<button className='hover:text-gray-400'>
						<FaFacebookF size={30} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Footer;
