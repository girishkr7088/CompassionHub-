import { motion } from "framer-motion";
import { 
  HeartIcon,
  UserGroupIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  CakeIcon,
} from "@heroicons/react/24/outline";

const Community = () => {
  const stats = [
    { id: 1, name: 'Meals Shared Daily', value: '25K+', icon: CakeIcon },
    { id: 2, name: 'Active Volunteers', value: '10K+', icon: UserGroupIcon },
    { id: 3, name: 'Communities Reached', value: '500+', icon: GlobeAltIcon },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Community Leader',
      content: 'This platform has transformed how we handle food surplus. It\'s amazing to see our community come together!',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Volunteer',
      content: 'I\'ve met incredible people while making a real difference in my neighborhood. Highly recommend joining!',
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Donor',
      content: 'So easy to donate excess food from my restaurant. The impact reports are truly inspiring!',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden py-24 px-6 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Join Our <span className="text-orange-600">Food Sharing</span> Revolution
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-xl leading-8 text-gray-600"
          >
            Connecting communities to reduce waste and fight hunger through collective action
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-orange-600 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center rounded-2xl bg-white/10 p-8 backdrop-blur-lg"
              >
                <stat.icon className="h-12 w-12 text-white mb-4" />
                <dt className="text-sm font-semibold leading-6 text-orange-100">{stat.name}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="bg-white p-8 rounded-3xl shadow-lg"
            >
              <div className="bg-orange-100 w-fit p-4 rounded-2xl mb-6">
                <HeartIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
              <p className="text-gray-600">Monitor your impact with live updates on donations and distribution</p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="bg-white p-8 rounded-3xl shadow-lg"
            >
              <div className="bg-orange-100 w-fit p-4 rounded-2xl mb-6">
                <ArrowPathIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainable Impact</h3>
              <p className="text-gray-600">Join our circular economy approach to food redistribution</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 sm:py-32 bg-orange-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-16"
          >
            Voices from Our Community
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <p className="text-lg text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-orange-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 text-center"
      >
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
            Ready to Make a Difference?
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Join Our Community Today
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Community;
