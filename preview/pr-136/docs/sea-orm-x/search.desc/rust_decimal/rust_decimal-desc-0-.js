searchState.loadedDescShard("rust_decimal", 0, "A Decimal number implementation written in pure Rust …\nThe number is always rounded away from zero. e.g. -6.8 -&gt; …\nWhen a number is halfway between two others, it is rounded …\nRepresents a failure to convert to/from <code>Decimal</code> to the …\n<code>Decimal</code> represents a 128 bit representation of a …\nContains the error value\nError type for the library.\nA generic error from Rust Decimal with the <code>String</code> …\nThe value provided exceeds <code>Decimal::MAX</code>.\nThe value provided is less than <code>Decimal::MIN</code>.\nThe largest value that can be represented by this decimal …\nThe smallest value that can be represented by this decimal …\nWhen a number is halfway between two others, it is rounded …\nWhen a number is halfway between two others, it is rounded …\nWhen a number is halfway between two others, it is rounded …\nA constant representing -1.\nA constant representing 1.\nA constant representing 100.\nA constant representing 1000.\nContains the success value\nShortcut for <code>core::result::Result&lt;T, rust_decimal::Error&gt;</code>. …\nAlways round down.\nRounds down if the value =&lt; 5, otherwise rounds up, e.g. …\nRounds up if the value &gt;= 5, otherwise rounds down, e.g. …\nAlways round up.\n<code>RoundingStrategy</code> represents the different rounding …\nThe scale provided exceeds the maximum scale that <code>Decimal</code> …\nA constant representing 10.\nA constant representing 2.\nThe number is always rounded towards negative infinity. …\nThe number is always rounded towards positive infinity. …\nThe number is always rounded toward zero. e.g. -6.8 -&gt; -6, …\nAn underflow is when there are more fractional digits than …\nA constant representing 0.\nComputes the absolute value of <code>self</code>.\nReturns the smallest integer greater than or equal to a …\nChecked addition. Computes <code>self + other</code>, returning <code>None</code> if …\nChecked division. Computes <code>self / other</code>, returning <code>None</code> if …\nChecked multiplication. Computes <code>self * other</code>, returning …\nChecked remainder. Computes <code>self % other</code>, returning <code>None</code> …\nChecked subtraction. Computes <code>self - other</code>, returning <code>None</code> …\nReturns the default value for a <code>Decimal</code> (equivalent to …\nDeserializes the given bytes into a decimal number. The …\nReturns the largest integer less than or equal to a number.\nReturns a new <code>Decimal</code> representing the fractional portion …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nParses a 32-bit float into a Decimal number whilst …\nParses a 64-bit float into a Decimal number whilst …\nCreates a <code>Decimal</code> using a 128 bit signed <code>m</code> representation …\nReturns a <code>Decimal</code> using the instances constituent parts.\nReturns a <code>Result</code> which if successful contains the <code>Decimal</code> …\nParses a string slice into a decimal. If the value …\nConverts a string slice in a given base to a decimal.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nReturns true if this Decimal number has zero fractional …\nReturns <code>true</code> if the decimal is negative.\nReturns <code>true</code> if the decimal is positive.\nReturns <code>true</code> if the sign bit of the decimal is negative.\nReturns <code>true</code> if the sign bit of the decimal is positive.\nReturns true if this Decimal number is equivalent to zero.\nReturns the mantissa of the decimal number.\nReturns the maximum of the two numbers.\nReturns the maximum possible number that <code>Decimal</code> can …\nReturns the minimum of the two numbers.\nReturns the minimum possible number that <code>Decimal</code> can …\nReturns a <code>Decimal</code> with a 64 bit <code>m</code> representation and …\nStrips any trailing zero’s from a <code>Decimal</code> and converts …\nAn in place version of <code>normalize</code>. Strips any trailing zero…\nA convenience module appropriate for glob imports (…\nPanics if out-of-bounds\nPanics if out-of-bounds\nModifies the <code>Decimal</code> towards the desired scale, attempting …\nReturns a new <code>Decimal</code> number with no fractional portion …\nReturns a new <code>Decimal</code> number with the specified number of …\nReturns a new <code>Decimal</code> number with the specified number of …\nReturns <code>Some(Decimal)</code> number rounded to the specified …\nReturns <code>Some(Decimal)</code> number rounded to the specified …\nSaturating addition. Computes <code>self + other</code>, saturating at …\nSaturating multiplication. Computes <code>self * other</code>, …\nSaturating subtraction. Computes <code>self - other</code>, saturating …\nReturns the scale of the decimal number, otherwise known …\nReturns a serialized version of the decimal number. The …\nAn optimized method for changing the scale of a decimal …\nAn optimized method for changing the sign of a decimal …\nAn optimized method for changing the sign of a decimal …\nAn optimized method for changing the sign of a decimal …\nReturns a new <code>Decimal</code> integral with no fractional portion. …\nReturns a new <code>Decimal</code> with the fractional portion …\nChecked version of <code>Decimal::from_i128_with_scale</code>. Will …\nChecked version of <code>Decimal::new</code>. Will return <code>Err</code> instead …\nConvert <code>Decimal</code> to an internal representation of the …\nThe associated error which can be returned from parsing.\nA generic trait for converting a number to a value.\nParse a value from a string\nDefines a multiplicative identity element for <code>Self</code>.\nUseful functions for signed numbers (i.e. numbers that can …\nA generic trait for converting a value to a number.\nDefines an additive identity element for <code>Self</code>.\nComputes the absolute value.\nThe positive difference of two numbers.\nConverts a <code>f32</code> to return an optional value of this type. …\nConverts a <code>f64</code> to return an optional value of this type. …\nConverts an <code>i128</code> to return an optional value of this type. …\nConverts an <code>i16</code> to return an optional value of this type. …\nConverts an <code>i32</code> to return an optional value of this type. …\nConverts an <code>i64</code> to return an optional value of this type. …\nConverts an <code>i8</code> to return an optional value of this type. …\nConverts an <code>isize</code> to return an optional value of this …\nParses a string <code>s</code> to return a value of this type.\nConverts an <code>u128</code> to return an optional value of this type. …\nConverts an <code>u16</code> to return an optional value of this type. …\nConverts an <code>u32</code> to return an optional value of this type. …\nConverts an <code>u64</code> to return an optional value of this type. …\nConverts an <code>u8</code> to return an optional value of this type. …\nConverts a <code>usize</code> to return an optional value of this type. …\nReturns true if the number is negative and false if the …\nReturns <code>true</code> if <code>self</code> is equal to the multiplicative …\nReturns true if the number is positive and false if the …\nReturns <code>true</code> if <code>self</code> is equal to the additive identity.\nReturns the multiplicative identity element of <code>Self</code>, <code>1</code>.\nSets <code>self</code> to the multiplicative identity element of <code>Self</code>, <code>1</code>…\nSets <code>self</code> to the additive identity element of <code>Self</code>, <code>0</code>.\nReturns the sign of the number.\nConverts the value of <code>self</code> to an <code>f32</code>. Overflows may map to …\nConverts the value of <code>self</code> to an <code>f64</code>. Overflows may map to …\nConverts the value of <code>self</code> to an <code>i128</code>. If the value cannot …\nConverts the value of <code>self</code> to an <code>i16</code>. If the value cannot …\nConverts the value of <code>self</code> to an <code>i32</code>. If the value cannot …\nConverts the value of <code>self</code> to an <code>i64</code>. If the value cannot …\nConverts the value of <code>self</code> to an <code>i8</code>. If the value cannot be\nConverts the value of <code>self</code> to an <code>isize</code>. If the value …\nConverts the value of <code>self</code> to a <code>u128</code>. If the value cannot …\nConverts the value of <code>self</code> to a <code>u16</code>. If the value cannot be\nConverts the value of <code>self</code> to a <code>u32</code>. If the value cannot be\nConverts the value of <code>self</code> to a <code>u64</code>. If the value cannot be\nConverts the value of <code>self</code> to a <code>u8</code>. If the value cannot be …\nConverts the value of <code>self</code> to a <code>usize</code>. If the value cannot …\nReturns the additive identity element of <code>Self</code>, <code>0</code>.")