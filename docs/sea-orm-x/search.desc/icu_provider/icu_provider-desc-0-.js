searchState.loadedDescShard("icu_provider", 0, "<code>icu_provider</code> is one of the <code>ICU4X</code> components.\nA data provider that loads data for a specific data type.\nThe type of the “cart” that is used by <code>DataPayload</code>.\nAn unspecified error occurred, such as a Serde error.\nThe error type for ICU4X data provider operations.\nA list specifying general categories of data provider …\nUsed for loading data from an ICU4X data provider.\nA compact hash of a <code>DataKey</code>. Useful for keys in maps.\nMetadata statically associated with a particular <code>DataKey</code>.\nThe string path of a data key. For example, “foo@1”\nA locale type optimized for use in fallbacking and the …\nA container for data payloads returned from a data …\nA data provider that loads data for a specific <code>DataKey</code>.\nA <code>DataProvider</code> associated with a specific key.\nThe request type passed into all data provider …\nMetadata for data requests. This is currently empty, but …\nA response object containing an object as payload and …\nA response object containing metadata about the returned …\nA data provider that loads data for a specific data type.\nThe request should not contain a locale.\nThe resource was blocked by a filter. The resource may or …\nA data provider object was given to an operation in an …\nThe syntax of the <code>DataKey</code> or <code>DataLocale</code> was invalid.\nThe generic type parameter does not match the TypeId. The …\nNo data for the provided resource key.\nThere is data for the key, but not for this particular …\nThe payload is missing. This is usually caused by a …\nThe request should include a locale.\nAn error indicating that the desired buffer format is not …\nTraits for data providers that produce <code>Any</code> objects.\nReturns the <code>DataKey</code> that this provider uses for loading …\nTraits for data providers that produce opaque buffers.\nThe format of the buffer for buffer-backed data, if known …\nConvert between two <code>DataMarker</code> types that are compatible …\nConvert between two <code>DataMarker</code> types that are compatible …\nRemoves all <code>Variant</code> subtags in this <code>DataLocale</code>.\nConst-friendly version of <code>Default::default</code>.\n📚 <em>This module documents ICU4X constructor signatures.</em>\nReturns whether a specific Unicode extension keyword is …\nReturns a new, empty DataError with kind Custom and a …\nSee <code>DataKey</code>.\nThe <code>#[data_struct]</code> attribute should be applied to all …\nTransforms a type-erased <code>DataPayload&lt;AnyMarker&gt;</code> into a …\nConvert a mutable reference of a <code>DataPayload</code> to another …\nUtilities for using trait objects with <code>DataPayload</code>.\nA Unicode extension keyword to consider when loading data …\nReturns the <code>LocaleFallbackConfig</code> for this <code>DataKey</code>.\nWhat to prioritize when fallbacking on this <code>DataKey</code>.\nOptional choice for additional fallbacking data required …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nConvert a fully owned (<code>&#39;static</code>) data struct into a …\nConverts an owned byte buffer into a …\nConstructs a <code>DataKey</code> from a path and metadata.\nConverts a static byte buffer into a …\nMake a <code>DataPayload</code><code>&lt;</code><code>HelloWorldV1Marker</code><code>&gt;</code> from a static …\nConverts a yoked byte buffer into a …\nBorrows the underlying data.\nGets the path as a static string slice.\nGets the <code>LanguageIdentifier</code> for this <code>DataLocale</code>.\nGets the value of the specified Unicode extension keyword …\nReturns whether there are any Unicode extension keywords …\nReturns whether there are any <code>Variant</code> subtags in this …\nGets a platform-independent hash of a <code>DataKey</code>.\nData provider returning multilingual “Hello World” …\nImplements <code>UpcastDataPayload</code> from several data markers to …\nImplements <code>DataProvider&lt;NeverMarker&lt;Y&gt;&gt;</code> on a struct.\nImplements <code>DynamicDataProvider</code> for a marker type <code>S</code> on a …\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nConverts this DataErrorKind into a DataError.\nConverts this <code>DataLocale</code> into a <code>Locale</code>.\nReturns whether this <code>DataLocale</code> has all empty fields (no …\nReturns whether the <code>LanguageIdentifier</code> associated with …\nReturns whether this <code>DataLocale</code> is <code>und</code> in the locale and …\nThe data key of the request, if available.\nBroad category of the error.\nReturns the <code>Language</code> for this <code>DataLocale</code>.\nQuery the provider for data, returning the result.\nQuery the provider for data, returning the result.\nQuery the provider for data, returning the result.\nThe locale for which to load data.\nThe resolved locale of the returned data, if locale …\nMaps <code>DataPayload&lt;M&gt;</code> to <code>DataPayload&lt;M2&gt;</code> by projecting it …\nVersion of <code>DataPayload::map_project()</code> that borrows <code>self</code> …\nMarker types and traits for DataProvider.\nReturns <code>Ok</code> if this data key matches the argument, or the …\nReturns whether this <code>DataLocale</code> contains a Unicode …\nGets the metadata associated with this <code>DataKey</code>.\nMetadata about the returned object.\nMetadata that may affect the behavior of the data provider.\nCreates a <code>DataProviderWithKey</code> from a <code>DataProvider</code> with a …\nGets a human-readable representation of a <code>DataKey</code>.\nThe object itself; <code>None</code> if it was not loaded.\nCore selection of APIs and structures for the ICU4X data …\nReturns the <code>Region</code> for this <code>DataLocale</code>.\nRemoves a specific Unicode extension keyword from this …\nRetains a subset of keywords as specified by the predicate …\nReturns the <code>Script</code> for this <code>DataLocale</code>.\nOverrides the entire <code>LanguageIdentifier</code> portion of this …\nReturns the <code>Language</code> for this <code>DataLocale</code>.\nSets the <code>Region</code> for this <code>DataLocale</code>.\nSets the <code>Script</code> for this <code>DataLocale</code>.\nSets the value for a specific Unicode extension keyword on …\nSets all <code>Variants</code> on this <code>DataLocale</code>, overwriting any that …\nWhether this error was created in silent mode to not log.\nSilent requests do not log errors. This can be used for …\nWhether the key has a singleton value, as opposed to …\nAdditional context, if available.\nCompare this <code>DataLocale</code> with BCP-47 bytes.\nTakes ownership of the underlying metadata and payload. …\nTakes ownership of the underlying payload. Error if not …\nGets the hash value as a byte array.\nReturns an ordering suitable for use in <code>BTreeSet</code>.\nCreates a <code>Yoke&lt;Y, Option&lt;Cart&gt;&gt;</code> from owned bytes by …\nVersion of <code>DataPayload::map_project()</code> that bubbles up an …\nVersion of <code>DataPayload::map_project_cloned()</code> that  bubbles …\nConvert a DataPayload that was created via …\nLogs the data error with the given context, then return …\nLogs the data error with the given context, then return …\nCreates a DataError with a resource key context.\nSets the resource key of a DataError, returning a modified …\nMutate the data contained in this DataPayload.\nCreates a DataError with a request context.\nLogs the data error with the given request, returning an …\nCreates a DataError with a string context.\nSets the string context of a DataError, returning a …\nCreates a DataError with a type name context.\nSets the string context of a DataError to the given type …\nConverts this DataPayload into a type-erased <code>AnyPayload</code>. …\nMoves the inner DataPayload to the heap (requiring an …\nThe <code>DataMarker</code> marker type for <code>AnyPayload</code>.\nA type-erased data payload.\nAn object-safe data provider that returns data structs …\nA <code>DataResponse</code> for type-erased values.\nBlanket-implemented trait adding the <code>Self::as_downcasting()</code>…\nBlanket-implemented trait adding the …\nA wrapper over <code>AnyProvider</code> that implements …\nA wrapper over <code>DynamicDataProvider&lt;AnyMarker&gt;</code> that …\nReturns an object implementing <code>AnyProvider</code> when called on …\nReturns an object implementing <code>DynamicDataProvider&lt;M&gt;</code> when …\nTransforms a type-erased <code>AnyPayload</code> into a concrete …\nTransforms a type-erased <code>AnyResponse</code> into a concrete …\nClones and then transforms a type-erased <code>AnyPayload</code> into a …\nClones and then transforms a type-erased <code>AnyResponse</code> into …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nCreates an <code>AnyPayload</code> from a static reference to a data …\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nLoads an <code>AnyPayload</code> according to the key and request.\nMetadata about the returned object.\nThe object itself; <code>None</code> if it was not loaded.\nSerialize using Bincode version 1.\nAn enum expressing all Serde formats known to ICU4X.\n<code>DataMarker</code> for raw buffers. Returned by <code>BufferProvider</code>.\nA data provider that returns opaque bytes.\nSerialize using JavaScript Object Notation (JSON).\nSerialize using Postcard version 1.\nReturns an error if the buffer format is not enabled.\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nLoads a <code>DataPayload</code><code>&lt;</code><code>BufferMarker</code><code>&gt;</code> according to the key and …\nTrait to allow conversion from <code>DataPayload&lt;T&gt;</code> to …\nUpcast a <code>DataPayload&lt;T&gt;</code> to a <code>DataPayload&lt;S&gt;</code> where <code>T</code> …\nA formatted hello world message. Implements <code>Writeable</code>.\nA type that formats localized “hello world” strings.\nA data provider returning Hello World strings in different …\nA struct containing “Hello World” in the requested …\nMarker type for <code>HelloWorldV1</code>.\nFormats a hello world message, returning a …\nFormats a hello world message, returning a <code>String</code>.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nThe translation of “Hello World”.\nCreates a new <code>HelloWorldFormatter</code> for the specified locale.\nA version of <code>Self::try_new</code> that uses custom data provided …\nA version of [<code>Self :: try_new</code>] that uses custom data …\nTrait marker for data structs. All types delivered by the …\nThe single <code>DataKey</code> associated with this marker.\nA <code>DataMarker</code> with a <code>DataKey</code> attached.\nA <code>DataMarker</code> that never returns data.\nA type that implements <code>Yokeable</code>. This should typically be …\nBinds this <code>KeyedDataMarker</code> to a provider supporting it.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.")