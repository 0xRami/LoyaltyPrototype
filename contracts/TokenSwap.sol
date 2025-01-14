// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.7.6;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol';

contract TokenSwap {
    IV3SwapRouter public immutable swapRouter;

    address public constant LT = 0x3194c32bFeD0Fe1Dc5E55dF975019ef6556304EB;

    uint24 public constant poolFee = 3000;

    constructor(IV3SwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function swapExactInputSingle(uint256 amountIn, address tokenOut, address to) external returns (uint256 amountOut) {
        // Transfer the specified amount of LT to this contract.
        TransferHelper.safeTransferFrom(LT, msg.sender, address(this), amountIn);

        // Approve the router to spend LT.
        TransferHelper.safeApprove(LT, address(swapRouter), amountIn);

        IV3SwapRouter.ExactInputSingleParams memory params =
            IV3SwapRouter.ExactInputSingleParams({
                tokenIn: LT,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: to,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }
}