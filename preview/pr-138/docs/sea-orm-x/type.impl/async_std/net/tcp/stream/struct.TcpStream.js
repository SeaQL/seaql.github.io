(function() {
    var type_impls = Object.fromEntries([["sqlz",[["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-AsRawFd-for-TcpStream\" class=\"impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#399\">source</a><a href=\"#impl-AsRawFd-for-TcpStream\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.83.0/std/os/fd/raw/trait.AsRawFd.html\" title=\"trait std::os::fd::raw::AsRawFd\">AsRawFd</a> for <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.as_raw_fd\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#400\">source</a><a href=\"#method.as_raw_fd\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.83.0/std/os/fd/raw/trait.AsRawFd.html#tymethod.as_raw_fd\" class=\"fn\">as_raw_fd</a>(&amp;self) -&gt; <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.i32.html\">i32</a></h4></section></summary><div class='docblock'>Extracts the raw file descriptor. <a href=\"https://doc.rust-lang.org/1.83.0/std/os/fd/raw/trait.AsRawFd.html#tymethod.as_raw_fd\">Read more</a></div></details></div></details>","AsRawFd","sqlz::mssql::connection::runtime_async_std::StreamType"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-AsyncRead-for-TcpStream\" class=\"impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#284\">source</a><a href=\"#impl-AsyncRead-for-TcpStream\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"futures_io/if_std/trait.AsyncRead.html\" title=\"trait futures_io::if_std::AsyncRead\">AsyncRead</a> for <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.poll_read\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#285-289\">source</a><a href=\"#method.poll_read\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"futures_io/if_std/trait.AsyncRead.html#tymethod.poll_read\" class=\"fn\">poll_read</a>(\n    self: <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/pin/struct.Pin.html\" title=\"struct core::pin::Pin\">Pin</a>&lt;&amp;mut <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a>&gt;,\n    cx: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/task/wake/struct.Context.html\" title=\"struct core::task::wake::Context\">Context</a>&lt;'_&gt;,\n    buf: &amp;mut [<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.u8.html\">u8</a>],\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/task/poll/enum.Poll.html\" title=\"enum core::task::poll::Poll\">Poll</a>&lt;<a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.usize.html\">usize</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;&gt;</h4></section></summary><div class='docblock'>Attempt to read from the <code>AsyncRead</code> into <code>buf</code>. <a href=\"futures_io/if_std/trait.AsyncRead.html#tymethod.poll_read\">Read more</a></div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.poll_read_vectored\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#293-297\">source</a><a href=\"#method.poll_read_vectored\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"futures_io/if_std/trait.AsyncRead.html#method.poll_read_vectored\" class=\"fn\">poll_read_vectored</a>(\n    self: <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/pin/struct.Pin.html\" title=\"struct core::pin::Pin\">Pin</a>&lt;&amp;mut <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a>&gt;,\n    cx: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/task/wake/struct.Context.html\" title=\"struct core::task::wake::Context\">Context</a>&lt;'_&gt;,\n    bufs: &amp;mut [<a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/struct.IoSliceMut.html\" title=\"struct std::io::IoSliceMut\">IoSliceMut</a>&lt;'_&gt;],\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/task/poll/enum.Poll.html\" title=\"enum core::task::poll::Poll\">Poll</a>&lt;<a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.usize.html\">usize</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;&gt;</h4></section></summary><div class='docblock'>Attempt to read from the <code>AsyncRead</code> into <code>bufs</code> using vectored\nIO operations. <a href=\"futures_io/if_std/trait.AsyncRead.html#method.poll_read_vectored\">Read more</a></div></details></div></details>","AsyncRead","sqlz::mssql::connection::runtime_async_std::StreamType"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-AsyncWrite-for-TcpStream\" class=\"impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#320\">source</a><a href=\"#impl-AsyncWrite-for-TcpStream\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"futures_io/if_std/trait.AsyncWrite.html\" title=\"trait futures_io::if_std::AsyncWrite\">AsyncWrite</a> for <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.poll_write\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#321-325\">source</a><a href=\"#method.poll_write\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"futures_io/if_std/trait.AsyncWrite.html#tymethod.poll_write\" class=\"fn\">poll_write</a>(\n    self: <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/pin/struct.Pin.html\" title=\"struct core::pin::Pin\">Pin</a>&lt;&amp;mut <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a>&gt;,\n    cx: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/task/wake/struct.Context.html\" title=\"struct core::task::wake::Context\">Context</a>&lt;'_&gt;,\n    buf: &amp;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.u8.html\">u8</a>],\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/task/poll/enum.Poll.html\" title=\"enum core::task::poll::Poll\">Poll</a>&lt;<a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.usize.html\">usize</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;&gt;</h4></section></summary><div class='docblock'>Attempt to write bytes from <code>buf</code> into the object. <a href=\"futures_io/if_std/trait.AsyncWrite.html#tymethod.poll_write\">Read more</a></div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.poll_write_vectored\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#329-333\">source</a><a href=\"#method.poll_write_vectored\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"futures_io/if_std/trait.AsyncWrite.html#method.poll_write_vectored\" class=\"fn\">poll_write_vectored</a>(\n    self: <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/pin/struct.Pin.html\" title=\"struct core::pin::Pin\">Pin</a>&lt;&amp;mut <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a>&gt;,\n    cx: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/task/wake/struct.Context.html\" title=\"struct core::task::wake::Context\">Context</a>&lt;'_&gt;,\n    bufs: &amp;[<a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/struct.IoSlice.html\" title=\"struct std::io::IoSlice\">IoSlice</a>&lt;'_&gt;],\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/task/poll/enum.Poll.html\" title=\"enum core::task::poll::Poll\">Poll</a>&lt;<a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.usize.html\">usize</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;&gt;</h4></section></summary><div class='docblock'>Attempt to write bytes from <code>bufs</code> into the object using vectored\nIO operations. <a href=\"futures_io/if_std/trait.AsyncWrite.html#method.poll_write_vectored\">Read more</a></div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.poll_flush\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#337\">source</a><a href=\"#method.poll_flush\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"futures_io/if_std/trait.AsyncWrite.html#tymethod.poll_flush\" class=\"fn\">poll_flush</a>(\n    self: <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/pin/struct.Pin.html\" title=\"struct core::pin::Pin\">Pin</a>&lt;&amp;mut <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a>&gt;,\n    cx: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/task/wake/struct.Context.html\" title=\"struct core::task::wake::Context\">Context</a>&lt;'_&gt;,\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/task/poll/enum.Poll.html\" title=\"enum core::task::poll::Poll\">Poll</a>&lt;<a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.unit.html\">()</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;&gt;</h4></section></summary><div class='docblock'>Attempt to flush the object, ensuring that any buffered data reach\ntheir destination. <a href=\"futures_io/if_std/trait.AsyncWrite.html#tymethod.poll_flush\">Read more</a></div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.poll_close\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#341\">source</a><a href=\"#method.poll_close\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"futures_io/if_std/trait.AsyncWrite.html#tymethod.poll_close\" class=\"fn\">poll_close</a>(\n    self: <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/pin/struct.Pin.html\" title=\"struct core::pin::Pin\">Pin</a>&lt;&amp;mut <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a>&gt;,\n    cx: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/task/wake/struct.Context.html\" title=\"struct core::task::wake::Context\">Context</a>&lt;'_&gt;,\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/task/poll/enum.Poll.html\" title=\"enum core::task::poll::Poll\">Poll</a>&lt;<a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.unit.html\">()</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;&gt;</h4></section></summary><div class='docblock'>Attempt to close the object. <a href=\"futures_io/if_std/trait.AsyncWrite.html#tymethod.poll_close\">Read more</a></div></details></div></details>","AsyncWrite","sqlz::mssql::connection::runtime_async_std::StreamType"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Clone-for-TcpStream\" class=\"impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#48\">source</a><a href=\"#impl-Clone-for-TcpStream\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.83.0/core/clone/trait.Clone.html\" title=\"trait core::clone::Clone\">Clone</a> for <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.clone\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#48\">source</a><a href=\"#method.clone\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.83.0/core/clone/trait.Clone.html#tymethod.clone\" class=\"fn\">clone</a>(&amp;self) -&gt; <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h4></section></summary><div class='docblock'>Returns a copy of the value. <a href=\"https://doc.rust-lang.org/1.83.0/core/clone/trait.Clone.html#tymethod.clone\">Read more</a></div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.clone_from\" class=\"method trait-impl\"><span class=\"rightside\"><span class=\"since\" title=\"Stable since Rust version 1.0.0\">1.0.0</span> · <a class=\"src\" href=\"https://doc.rust-lang.org/1.83.0/src/core/clone.rs.html#174\">source</a></span><a href=\"#method.clone_from\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.83.0/core/clone/trait.Clone.html#method.clone_from\" class=\"fn\">clone_from</a>(&amp;mut self, source: &amp;Self)</h4></section></summary><div class='docblock'>Performs copy-assignment from <code>source</code>. <a href=\"https://doc.rust-lang.org/1.83.0/core/clone/trait.Clone.html#method.clone_from\">Read more</a></div></details></div></details>","Clone","sqlz::mssql::connection::runtime_async_std::StreamType"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Debug-for-TcpStream\" class=\"impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#48\">source</a><a href=\"#impl-Debug-for-TcpStream\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.83.0/core/fmt/trait.Debug.html\" title=\"trait core::fmt::Debug\">Debug</a> for <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.fmt\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#48\">source</a><a href=\"#method.fmt\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.83.0/core/fmt/trait.Debug.html#tymethod.fmt\" class=\"fn\">fmt</a>(&amp;self, f: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/fmt/struct.Formatter.html\" title=\"struct core::fmt::Formatter\">Formatter</a>&lt;'_&gt;) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.unit.html\">()</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/core/fmt/struct.Error.html\" title=\"struct core::fmt::Error\">Error</a>&gt;</h4></section></summary><div class='docblock'>Formats the value using the given formatter. <a href=\"https://doc.rust-lang.org/1.83.0/core/fmt/trait.Debug.html#tymethod.fmt\">Read more</a></div></details></div></details>","Debug","sqlz::mssql::connection::runtime_async_std::StreamType"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-From%3CTcpStream%3E-for-TcpStream\" class=\"impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#372\">source</a><a href=\"#impl-From%3CTcpStream%3E-for-TcpStream\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.83.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/net/tcp/struct.TcpStream.html\" title=\"struct std::net::tcp::TcpStream\">TcpStream</a>&gt; for <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.from\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#374\">source</a><a href=\"#method.from\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.83.0/core/convert/trait.From.html#tymethod.from\" class=\"fn\">from</a>(stream: <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/net/tcp/struct.TcpStream.html\" title=\"struct std::net::tcp::TcpStream\">TcpStream</a>) -&gt; <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h4></section></summary><div class=\"docblock\"><p>Converts a <code>std::net::TcpStream</code> into its asynchronous equivalent.</p>\n</div></details></div></details>","From<TcpStream>","sqlz::mssql::connection::runtime_async_std::StreamType"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-FromRawFd-for-TcpStream\" class=\"impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#405\">source</a><a href=\"#impl-FromRawFd-for-TcpStream\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.83.0/std/os/fd/raw/trait.FromRawFd.html\" title=\"trait std::os::fd::raw::FromRawFd\">FromRawFd</a> for <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.from_raw_fd\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#406\">source</a><a href=\"#method.from_raw_fd\" class=\"anchor\">§</a><h4 class=\"code-header\">unsafe fn <a href=\"https://doc.rust-lang.org/1.83.0/std/os/fd/raw/trait.FromRawFd.html#tymethod.from_raw_fd\" class=\"fn\">from_raw_fd</a>(fd: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.i32.html\">i32</a>) -&gt; <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h4></section></summary><div class='docblock'>Constructs a new instance of <code>Self</code> from the given raw file\ndescriptor. <a href=\"https://doc.rust-lang.org/1.83.0/std/os/fd/raw/trait.FromRawFd.html#tymethod.from_raw_fd\">Read more</a></div></details></div></details>","FromRawFd","sqlz::mssql::connection::runtime_async_std::StreamType"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-IntoRawFd-for-TcpStream\" class=\"impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#411\">source</a><a href=\"#impl-IntoRawFd-for-TcpStream\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.83.0/std/os/fd/raw/trait.IntoRawFd.html\" title=\"trait std::os::fd::raw::IntoRawFd\">IntoRawFd</a> for <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.into_raw_fd\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#412\">source</a><a href=\"#method.into_raw_fd\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.83.0/std/os/fd/raw/trait.IntoRawFd.html#tymethod.into_raw_fd\" class=\"fn\">into_raw_fd</a>(self) -&gt; <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.i32.html\">i32</a></h4></section></summary><div class='docblock'>Consumes this object, returning the raw underlying file descriptor. <a href=\"https://doc.rust-lang.org/1.83.0/std/os/fd/raw/trait.IntoRawFd.html#tymethod.into_raw_fd\">Read more</a></div></details></div></details>","IntoRawFd","sqlz::mssql::connection::runtime_async_std::StreamType"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-TcpStream\" class=\"impl\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#53\">source</a><a href=\"#impl-TcpStream\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.connect\" class=\"method\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#73\">source</a><h4 class=\"code-header\">pub async fn <a href=\"async_std/net/tcp/stream/struct.TcpStream.html#tymethod.connect\" class=\"fn\">connect</a>&lt;A&gt;(addrs: A) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"struct\" href=\"async_std/net/tcp/stream/struct.TcpStream.html\" title=\"struct async_std::net::tcp::stream::TcpStream\">TcpStream</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;<div class=\"where\">where\n    A: <a class=\"trait\" href=\"async_std/net/addr/trait.ToSocketAddrs.html\" title=\"trait async_std::net::addr::ToSocketAddrs\">ToSocketAddrs</a>,</div></h4></section></summary><div class=\"docblock\"><p>Creates a new TCP stream connected to the specified address.</p>\n<p>This method will create a new TCP socket and attempt to connect it to the <code>addr</code>\nprovided. The <a href=\"struct.Connect.html\">returned future</a> will be resolved once the stream has successfully\nconnected, or it will return an error if one occurs.</p>\n<h5 id=\"examples\"><a class=\"doc-anchor\" href=\"#examples\">§</a>Examples</h5>\n<div class=\"example-wrap\"><pre class=\"rust rust-example-rendered\"><code><span class=\"kw\">use </span>async_std::net::TcpStream;\n\n<span class=\"kw\">let </span>stream = TcpStream::connect(<span class=\"string\">\"127.0.0.1:0\"</span>).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;</code></pre></div>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.local_addr\" class=\"method\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#113\">source</a><h4 class=\"code-header\">pub fn <a href=\"async_std/net/tcp/stream/struct.TcpStream.html#tymethod.local_addr\" class=\"fn\">local_addr</a>(&amp;self) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/net/socket_addr/enum.SocketAddr.html\" title=\"enum core::net::socket_addr::SocketAddr\">SocketAddr</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;</h4></section></summary><div class=\"docblock\"><p>Returns the local address that this stream is connected to.</p>\n<h6 id=\"examples-1\"><a class=\"doc-anchor\" href=\"#examples-1\">§</a>Examples</h6>\n<div class=\"example-wrap\"><pre class=\"rust rust-example-rendered\"><code><span class=\"kw\">use </span>async_std::net::TcpStream;\n\n<span class=\"kw\">let </span>stream = TcpStream::connect(<span class=\"string\">\"127.0.0.1:8080\"</span>).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;\n<span class=\"kw\">let </span>addr = stream.local_addr()<span class=\"question-mark\">?</span>;</code></pre></div>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.peer_addr\" class=\"method\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#131\">source</a><h4 class=\"code-header\">pub fn <a href=\"async_std/net/tcp/stream/struct.TcpStream.html#tymethod.peer_addr\" class=\"fn\">peer_addr</a>(&amp;self) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/net/socket_addr/enum.SocketAddr.html\" title=\"enum core::net::socket_addr::SocketAddr\">SocketAddr</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;</h4></section></summary><div class=\"docblock\"><p>Returns the remote address that this stream is connected to.</p>\n<h6 id=\"examples-2\"><a class=\"doc-anchor\" href=\"#examples-2\">§</a>Examples</h6>\n<div class=\"example-wrap\"><pre class=\"rust rust-example-rendered\"><code><span class=\"kw\">use </span>async_std::net::TcpStream;\n\n<span class=\"kw\">let </span>stream = TcpStream::connect(<span class=\"string\">\"127.0.0.1:8080\"</span>).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;\n<span class=\"kw\">let </span>peer = stream.peer_addr()<span class=\"question-mark\">?</span>;</code></pre></div>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.ttl\" class=\"method\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#155\">source</a><h4 class=\"code-header\">pub fn <a href=\"async_std/net/tcp/stream/struct.TcpStream.html#tymethod.ttl\" class=\"fn\">ttl</a>(&amp;self) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.u32.html\">u32</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;</h4></section></summary><div class=\"docblock\"><p>Gets the value of the <code>IP_TTL</code> option for this socket.</p>\n<p>For more information about this option, see <a href=\"#method.set_ttl\"><code>set_ttl</code></a>.</p>\n<h5 id=\"examples-3\"><a class=\"doc-anchor\" href=\"#examples-3\">§</a>Examples</h5>\n<div class=\"example-wrap\"><pre class=\"rust rust-example-rendered\"><code><span class=\"kw\">use </span>async_std::net::TcpStream;\n\n<span class=\"kw\">let </span>stream = TcpStream::connect(<span class=\"string\">\"127.0.0.1:8080\"</span>).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;\n\nstream.set_ttl(<span class=\"number\">100</span>)<span class=\"question-mark\">?</span>;\n<span class=\"macro\">assert_eq!</span>(stream.ttl()<span class=\"question-mark\">?</span>, <span class=\"number\">100</span>);</code></pre></div>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.set_ttl\" class=\"method\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#178\">source</a><h4 class=\"code-header\">pub fn <a href=\"async_std/net/tcp/stream/struct.TcpStream.html#tymethod.set_ttl\" class=\"fn\">set_ttl</a>(&amp;self, ttl: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.u32.html\">u32</a>) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.unit.html\">()</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;</h4></section></summary><div class=\"docblock\"><p>Sets the value for the <code>IP_TTL</code> option on this socket.</p>\n<p>This value sets the time-to-live field that is used in every packet sent\nfrom this socket.</p>\n<h5 id=\"examples-4\"><a class=\"doc-anchor\" href=\"#examples-4\">§</a>Examples</h5>\n<div class=\"example-wrap\"><pre class=\"rust rust-example-rendered\"><code><span class=\"kw\">use </span>async_std::net::TcpStream;\n\n<span class=\"kw\">let </span>stream = TcpStream::connect(<span class=\"string\">\"127.0.0.1:8080\"</span>).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;\n\nstream.set_ttl(<span class=\"number\">100</span>)<span class=\"question-mark\">?</span>;\n<span class=\"macro\">assert_eq!</span>(stream.ttl()<span class=\"question-mark\">?</span>, <span class=\"number\">100</span>);</code></pre></div>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.peek\" class=\"method\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#204\">source</a><h4 class=\"code-header\">pub async fn <a href=\"async_std/net/tcp/stream/struct.TcpStream.html#tymethod.peek\" class=\"fn\">peek</a>(&amp;self, buf: &amp;mut [<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.u8.html\">u8</a>]) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.usize.html\">usize</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;</h4></section></summary><div class=\"docblock\"><p>Receives data on the socket from the remote address to which it is connected, without\nremoving that data from the queue.</p>\n<p>On success, returns the number of bytes peeked.</p>\n<p>Successive calls return the same data. This is accomplished by passing <code>MSG_PEEK</code> as a flag\nto the underlying <code>recv</code> system call.</p>\n<h5 id=\"examples-5\"><a class=\"doc-anchor\" href=\"#examples-5\">§</a>Examples</h5>\n<div class=\"example-wrap\"><pre class=\"rust rust-example-rendered\"><code><span class=\"kw\">use </span>async_std::net::TcpStream;\n\n<span class=\"kw\">let </span>stream = TcpStream::connect(<span class=\"string\">\"127.0.0.1:8000\"</span>).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;\n\n<span class=\"kw\">let </span><span class=\"kw-2\">mut </span>buf = <span class=\"macro\">vec!</span>[<span class=\"number\">0</span>; <span class=\"number\">1024</span>];\n<span class=\"kw\">let </span>n = stream.peek(<span class=\"kw-2\">&amp;mut </span>buf).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;</code></pre></div>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.nodelay\" class=\"method\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#228\">source</a><h4 class=\"code-header\">pub fn <a href=\"async_std/net/tcp/stream/struct.TcpStream.html#tymethod.nodelay\" class=\"fn\">nodelay</a>(&amp;self) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.bool.html\">bool</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;</h4></section></summary><div class=\"docblock\"><p>Gets the value of the <code>TCP_NODELAY</code> option on this socket.</p>\n<p>For more information about this option, see <a href=\"#method.set_nodelay\"><code>set_nodelay</code></a>.</p>\n<h5 id=\"examples-6\"><a class=\"doc-anchor\" href=\"#examples-6\">§</a>Examples</h5>\n<div class=\"example-wrap\"><pre class=\"rust rust-example-rendered\"><code><span class=\"kw\">use </span>async_std::net::TcpStream;\n\n<span class=\"kw\">let </span>stream = TcpStream::connect(<span class=\"string\">\"127.0.0.1:8080\"</span>).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;\n\nstream.set_nodelay(<span class=\"bool-val\">true</span>)<span class=\"question-mark\">?</span>;\n<span class=\"macro\">assert_eq!</span>(stream.nodelay()<span class=\"question-mark\">?</span>, <span class=\"bool-val\">true</span>);</code></pre></div>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.set_nodelay\" class=\"method\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#254\">source</a><h4 class=\"code-header\">pub fn <a href=\"async_std/net/tcp/stream/struct.TcpStream.html#tymethod.set_nodelay\" class=\"fn\">set_nodelay</a>(&amp;self, nodelay: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.bool.html\">bool</a>) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.unit.html\">()</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;</h4></section></summary><div class=\"docblock\"><p>Sets the value of the <code>TCP_NODELAY</code> option on this socket.</p>\n<p>If set, this option disables the Nagle algorithm. This means that\nsegments are always sent as soon as possible, even if there is only a\nsmall amount of data. When not set, data is buffered until there is a\nsufficient amount to send out, thereby avoiding the frequent sending of\nsmall packets.</p>\n<h5 id=\"examples-7\"><a class=\"doc-anchor\" href=\"#examples-7\">§</a>Examples</h5>\n<div class=\"example-wrap\"><pre class=\"rust rust-example-rendered\"><code><span class=\"kw\">use </span>async_std::net::TcpStream;\n\n<span class=\"kw\">let </span>stream = TcpStream::connect(<span class=\"string\">\"127.0.0.1:8080\"</span>).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;\n\nstream.set_nodelay(<span class=\"bool-val\">true</span>)<span class=\"question-mark\">?</span>;\n<span class=\"macro\">assert_eq!</span>(stream.nodelay()<span class=\"question-mark\">?</span>, <span class=\"bool-val\">true</span>);</code></pre></div>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.shutdown\" class=\"method\"><a class=\"src rightside\" href=\"src/async_std/net/tcp/stream.rs.html#279\">source</a><h4 class=\"code-header\">pub fn <a href=\"async_std/net/tcp/stream/struct.TcpStream.html#tymethod.shutdown\" class=\"fn\">shutdown</a>(&amp;self, how: <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/std/net/enum.Shutdown.html\" title=\"enum std::net::Shutdown\">Shutdown</a>) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.83.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.83.0/std/primitive.unit.html\">()</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.83.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt;</h4></section></summary><div class=\"docblock\"><p>Shuts down the read, write, or both halves of this connection.</p>\n<p>This method will cause all pending and future I/O on the specified portions to return\nimmediately with an appropriate value (see the documentation of <a href=\"https://doc.rust-lang.org/std/net/enum.Shutdown.html\"><code>Shutdown</code></a>).</p>\n<h5 id=\"examples-8\"><a class=\"doc-anchor\" href=\"#examples-8\">§</a>Examples</h5>\n<div class=\"example-wrap\"><pre class=\"rust rust-example-rendered\"><code><span class=\"kw\">use </span>std::net::Shutdown;\n\n<span class=\"kw\">use </span>async_std::net::TcpStream;\n\n<span class=\"kw\">let </span>stream = TcpStream::connect(<span class=\"string\">\"127.0.0.1:8080\"</span>).<span class=\"kw\">await</span><span class=\"question-mark\">?</span>;\nstream.shutdown(Shutdown::Both)<span class=\"question-mark\">?</span>;</code></pre></div>\n</div></details></div></details>",0,"sqlz::mssql::connection::runtime_async_std::StreamType"]]]]);
    if (window.register_type_impls) {
        window.register_type_impls(type_impls);
    } else {
        window.pending_type_impls = type_impls;
    }
})()
//{"start":55,"fragment_lengths":[38315]}