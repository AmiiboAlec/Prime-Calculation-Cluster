The coprimes optimization is based around the fact that depending on what base you're working in, only numbers with specific last digits may be prime. For example, in Base 10, only numbers ending in 1, 3, 7, or 9 can be prime*.
The best bases for these are those of the form product(1,n,π) where product() is the summation notation for products, and π is the function that for π(n) returns the n'th prime number. 
i.e., π(1) = 2, π(2) = 3, π(3) = 5, etc.

so lets say product(1,n,π) = g(n)
g(1) = 2, g(2) = 6, g(3) = 30, etc.

The "last digits" needed to check for primality end up being those which are coprime with the base in question. I'm uncertain if there's any general pattern to these, so I instead pre-compute them and load them into an array at runtime. 
The marginal benefit quickly diminishes, while the memory usage goes up exponentially. My guess is that the optimal base for calculation is the largest array that fits into your CPU's cache, although this remains to be tested.

The ratio of "skippable" numbers in any given base g(n) is product(1,n,f), where f(n) = ((π(n) - 1) / π(n))
