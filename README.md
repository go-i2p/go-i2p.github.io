# Overview of I2P For Go

A wide variety of tools exist which make it easy to use I2P as a network layer in Go applications.
These tools integrate at various levels and provide different functionality, but virtually anything is possible using I2P and Go.
Eventually, this page will serve as a website for `go-i2p`, but for now it serves to track the state of various ways of using Go to interact with I2P.

## Stuff that works:

### Router Implementations

 - [`go-i2p` a pure-Go implementation of the I2P Router `WIP`](https://github.com/go-i2p/go-i2p) - `WIP`

### `net.Conn` and `net.PacketConn` interface implementations

These act as drop-in replacements for `net.Conn` and `net.PacketConn` in your code and libraries.
When used correctly, they make it easy to adapt Go applications to I2P.
All `net.Conn` and `net.PacketConn` interface implementations in Go

- [`onramp` an easy-to-use, automatically-configured library for managing I2P connections, implements net.Conn and net.PacketConn, supports Primary sessions](https://github.com/go-i2p/onramp) - `mature, implements SAMv3.3, Streaming and Datagrams`
- [`goSam` simple and highly configurable net.Conn implementation, implement a complete HTTP/S/CONNECT proxy in ~50 LOC](https://github.com/go-i2p/goSam) - `mature, implements SAMv3.2, Streaming Only`
- [`go-sam-go` hightly configurable net.Conn, net.PacketConn implementation, supports Primary sessions, exposes all the options and all the sharp edges](https://github.com/go-i2p/go-sam-go) - `mature, implements SAMv3.3, Streaming and Datagrams`

### `net.Addr` interface implementation

- [`i2pkeys`, formerly part of `sam3(above)`, now a standalone library used by `onramp`, `goSam`, and `sam3` for common ways of handling loading, unloading, and processing I2P keys](https://github.com/go-i2p/i2pkeys)

### I2PControl-RPC Libraries

- [`go-i2pcontrol` an implementation of the I2PControl-RPC protocol in Go as a library](https://github.com/go-i2p/go-i2pcontrol) - `mature but does not provide all possible consts(like ratestats)`
- [`i2p-control` CLI application built using/as a demo of `go-i2pcontrol`](https://github.com/go-i2p/i2p-control) - `mature but may lack features`

### Proxies and Application-Layer Adapters

- [`go-i2p-bt` a Bittorrent library configured using `onramp` which tracks SAMv3 development and has similar features to I2PSnark](https://github.com/go-i2p/go-i2p-bt) - `not mature`

### Software

- [`reseed-tools` a freestanding implementation of an I2P Reseed server](https://i2pgit.org/idk/reseed-tools/) - `mature and extensively used/tested`
- [`railroad` a blog mostly compatible with Ghost style themes with markdown-based editing](https://i2pggit.org/idk/railroad) - `not mature`
