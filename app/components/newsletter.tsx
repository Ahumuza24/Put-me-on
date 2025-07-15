import { motion } from 'framer-motion'
import { MailIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const Newsletter = () => {
    return (
        <section className="py-20 px-5">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-12 border"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-16 h-16 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center"
                    >
                        <MailIcon className="w-8 h-8 text-primary" />
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-2xl md:text-3xl font-bold mb-4"
                    >
                        Stay in the Loop
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-muted-foreground mb-8"
                    >
                        Get top freelancers and deals straight to your inbox
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                    >
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 h-12"
                        />
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button size="lg" className="h-12 px-8">
                                Subscribe
                            </Button>
                        </motion.div>
                    </motion.div>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-xs text-muted-foreground mt-4"
                    >
                        No spam, unsubscribe at any time
                    </motion.p>
                </motion.div>
            </div>
        </section>
    )
}

export default Newsletter