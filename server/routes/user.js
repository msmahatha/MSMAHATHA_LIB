import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/user/stash
// @desc    Add book to stash
// @access  Private
router.post('/stash', authenticate, async (req, res) => {
  try {
    const { bookId, title, authors, thumbnail } = req.body;

    if (!bookId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Book ID and title are required.'
      });
    }

    // Check if already in stash
    const existingIndex = req.user.stash.findIndex(
      item => item.bookId === bookId
    );

    if (existingIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: 'Book already in stash.'
      });
    }

    // Add to stash
    req.user.stash.unshift({
      bookId,
      title,
      authors: authors || [],
      thumbnail: thumbnail || ''
    });

    await req.user.save();

    res.json({
      success: true,
      message: 'Book added to stash!',
      stash: req.user.stash
    });
  } catch (error) {
    console.error('Add to stash error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to stash.'
    });
  }
});

// @route   DELETE /api/user/stash/:bookId
// @desc    Remove book from stash
// @access  Private
router.delete('/stash/:bookId', authenticate, async (req, res) => {
  try {
    const { bookId } = req.params;

    req.user.stash = req.user.stash.filter(
      item => item.bookId !== bookId
    );

    await req.user.save();

    res.json({
      success: true,
      message: 'Book removed from stash.',
      stash: req.user.stash
    });
  } catch (error) {
    console.error('Remove from stash error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from stash.'
    });
  }
});

// @route   POST /api/user/history
// @desc    Add book to history
// @access  Private
router.post('/history', authenticate, async (req, res) => {
  try {
    const { bookId, title, authors, thumbnail } = req.body;

    if (!bookId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Book ID and title are required.'
      });
    }

    // Remove if already in history
    req.user.history = req.user.history.filter(
      item => item.bookId !== bookId
    );

    // Add to beginning
    req.user.history.unshift({
      bookId,
      title,
      authors: authors || [],
      thumbnail: thumbnail || ''
    });

    // Keep only last 50 items
    if (req.user.history.length > 50) {
      req.user.history = req.user.history.slice(0, 50);
    }

    await req.user.save();

    res.json({
      success: true,
      message: 'Book added to history.',
      history: req.user.history
    });
  } catch (error) {
    console.error('Add to history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to history.'
    });
  }
});

// @route   DELETE /api/user/history/:bookId
// @desc    Remove book from history
// @access  Private
router.delete('/history/:bookId', authenticate, async (req, res) => {
  try {
    const { bookId } = req.params;

    req.user.history = req.user.history.filter(
      item => item.bookId !== bookId
    );

    await req.user.save();

    res.json({
      success: true,
      message: 'Book removed from history.',
      history: req.user.history
    });
  } catch (error) {
    console.error('Remove from history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from history.'
    });
  }
});

// @route   PUT /api/user/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', authenticate, async (req, res) => {
  try {
    const { soundEnabled, crtEffect } = req.body;

    if (soundEnabled !== undefined) {
      req.user.settings.soundEnabled = soundEnabled;
    }

    if (crtEffect !== undefined) {
      req.user.settings.crtEffect = crtEffect;
    }

    await req.user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully.',
      settings: req.user.settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating settings.'
    });
  }
});

export default router;
