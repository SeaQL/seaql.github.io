searchState.loadedDescShard("spin", 0, "This crate provides spin-based versions of the primitives …\nA primitive that synchronizes the execution of multiple …\nA value which is initialized on the first access. See …\nA primitive that synchronizes the execution of multiple …\nA primitive that provides lazy one-time initialization. …\nA lock that provides data access to either one writer or …\nA guard that provides immutable data access but can be …\nA guard that provides mutable data access. See …\nSynchronization primitive allowing multiple threads to …\nSynchronization primitives for lazy evaluation.\nSpin synchronisation primitives, but compatible with …\nLocks that have the same behaviour as a mutex.\nSynchronization primitives for one-time evaluation.\nStrategies that determine the behaviour of locks when …\nA lock that provides data access to either one writer or …\nA primitive that synchronizes the execution of multiple …\nA <code>BarrierWaitResult</code> is returned by <code>wait</code> when all threads …\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nReturns whether this thread from <code>wait</code> is the “leader …\nCreates a new barrier that can block a given number of …\nBlocks the current thread until all threads have …\nA value which is initialized on the first access.\nRetrieves a mutable pointer to the inner data.\nCreates a new lazy value using <code>Default</code> as the initializing …\nForces the evaluation of this lazy value and returns a …\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCreates a new lazy value with the given initializing …\nA lock that provides mutually exclusive data access …\nA guard that provides mutable data access (compatible with …\nA lock that provides data access to either one writer or …\nA guard that provides immutable data access (compatible …\nA guard that provides immutable data access but can be …\nA guard that provides mutable data access (compatible with …\nA spin-based lock providing mutually exclusive access to …\nA generic guard that will protect some data access and …\nForce unlock this <code>Mutex</code>.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns a mutable reference to the underlying data.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nConsumes this <code>Mutex</code> and unwraps the underlying data.\nReturns <code>true</code> if the lock is currently held.\nLeak the lock guard, yielding a mutable reference to the …\nLocks the <code>Mutex</code> and returns a guard that permits access to …\nCreates a new <code>Mutex</code> wrapping the supplied data.\nA naïve spinning mutex.\nTry to lock this <code>Mutex</code>, returning a lock guard if …\nA spin lock providing mutually exclusive access to data.\nA guard that provides mutable data access.\nReturns a mutable pointer to the underlying data.\nThe dropping of the MutexGuard will release the lock it …\nForce unlock this <code>SpinMutex</code>.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns a mutable reference to the underlying data.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nConsumes this <code>SpinMutex</code> and unwraps the underlying data.\nReturns <code>true</code> if the lock is currently held.\nLeak the lock guard, yielding a mutable reference to the …\nLocks the <code>SpinMutex</code> and returns a guard that permits …\nCreates a new <code>SpinMutex</code> wrapping the supplied data.\nTry to lock this <code>SpinMutex</code>, returning a lock guard if …\nInitialization constant of <code>Once</code>.\nA primitive that provides lazy one-time initialization.\nRetrieve a pointer to the inner data.\nPerforms an initialization routine once and only once. The …\nReturns the argument unchanged.\nReturns a reference to the inner value if the <code>Once</code> has …\nReturns a mutable reference to the inner value if the <code>Once</code> …\nReturns a mutable reference to the inner value\nReturns a reference to the inner value on the unchecked …\nCreates a new initialized <code>Once</code>.\nCalls <code>U::from(self)</code>.\nReturns a the inner value if the <code>Once</code> has been initialized.\nChecks whether the value has been initialized.\nCreates a new <code>Once</code>.\nLike <code>Once::get</code>, but will spin if the <code>Once</code> is in the …\nThis method is similar to <code>call_once</code>, but allows the given …\nReturns a the inner value if the <code>Once</code> has been initialized.\nSpins until the <code>Once</code> contains a value.\nA strategy that rapidly spins, without telling the CPU to …\nA trait implemented by spinning relax strategies.\nA strategy that rapidly spins while informing the CPU that …\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nPerform the relaxing operation during a period of …\nA lock that provides data access to either one writer or …\nA guard that provides immutable data access.\nA guard that provides immutable data access but can be …\nA guard that provides mutable data access.\nReturns a mutable pointer to the underying data.\nDowngrades the writable lock guard to a readable, shared …\nDowngrades the upgradeable lock guard to a readable, …\nDowngrades the writable lock guard to an upgradable, …\nForce decrement the reader count.\nForce unlock exclusive write access.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns a mutable reference to the underlying data.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nConsumes this <code>RwLock</code>, returning the underlying data.\nLeak the lock guard, yielding a reference to the …\nLeak the lock guard, yielding a mutable reference to the …\nLeak the lock guard, yielding a reference to the …\nCreates a new spinlock wrapping the supplied data.\nLocks this rwlock with shared read access, blocking the …\nReturn the number of readers that currently hold the lock …\nAttempt to acquire this lock with shared read access.\nTries to upgrade an upgradeable lock guard to a writable …\nTries to obtain an upgradeable lock guard.\nAttempt to lock this rwlock with exclusive write access.\nUpgrades an upgradeable lock guard to a writable lock …\nObtain a readable lock guard that can later be upgraded to …\nLock this rwlock with exclusive write access, blocking the …\nReturn the number of writers that currently hold the lock.")